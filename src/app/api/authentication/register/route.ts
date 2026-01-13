import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { email, z } from 'zod';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { AccountType, Area, Gender, Language, Pronoun } from '~/generated/prisma/enums';
import type {
  AccountCreateInput,
  EmployeeUncheckedCreateInput,
  UserUncheckedCreateInput,
} from '~/generated/prisma/models';

import { createAccountTx } from '../../account/services';
import { sendRegistrationCodeEmail } from '../../email/service';
import { createEmployeeTx } from '../../employee/services';
import { handleValidationError, validateHeader } from '../../helper';
import { createUserTx } from '../../user/services';

// const registrationSchema = z.strictObject({
//   email: z.string().min(5), // TODO: add email regex validation and mybe move to helper file
//   password: z.string().min(Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH) || 8), // TODO: ask what our password policy should be
//   type: z.enum(AccountType),

//   firstname: z.string(),
//   lastname: z.string(),
//   title: z.string().optional(),
//   gender: z.enum(Gender),
//   genderText: z.string().optional(),
//   pronoun: z.enum(Pronoun).optional(),
//   pronounText: z.string().optional(),
//   birthdate: z.string(), // TODO: add date validation and mybe move to helper file
//   phone: z.string().optional(), // TODO: add phone regex validation and mybe move to helper file
//   country: z.string().optional(),
//   city: z.string().optional(),
//   zipCode: z.string().optional(),
//   street: z.string().optional(),
//   houseNumber: z.string().optional(),

//   organizationId: z.string().optional(), // only for EMPLOYEE registration
//   position: z.string().optional(), // only for EMPLOYEE registration
//   expertiseArea: z.array(z.enum(Area)).optional(), // only for EMPLOYEE registration
//   languages: z.array(z.enum(Language)).optional(), // only for EMPLOYEE registration
// });

const accountSchema = z.strictObject({
  email: z.string().min(5), // TODO: add email regex validation and maybe move to helper file
  password: z.string().min(Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH) || 8), // TODO: ask what our password policy should be
  type: z.enum(AccountType),
});

const baseRegistrationSchema = z.strictObject({
  firstname: z.string(),
  lastname: z.string(),
  title: z.string().optional(),
  gender: z.enum(Gender),
  genderText: z.string().optional(),
  pronoun: z.enum(Pronoun).optional(),
  pronounText: z.string().optional(),
  phone: z.string().optional(), // TODO: add phone regex validation and maybe move to helper file
});

const userRegistrationSchema = baseRegistrationSchema.extend({
  birthdate: z.coerce.date(), // coerce: auto convert string to date TODO: add date validation and maybe move to helper file
  placeOfBirth: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  houseNumber: z.string().optional(),
});

const employeeRegistrationSchema = baseRegistrationSchema.extend({
  description: z.string().optional(),
  email: z.string().min(5), // TODO: add email regex validation and maybe move to helper file
  organizationId: z.string().min(1), // Erforderlich und nicht leer
  position: z.string().optional(),
  expertiseArea: z.array(z.enum(Area)).min(1), // Mindestens 1 Element
  languages: z.array(z.enum(Language)).min(1), // Mindestens 1 Element
});

const registrationSchema = z.strictObject({
  account: accountSchema,
  entity: z.union([userRegistrationSchema, employeeRegistrationSchema]),
});

export async function POST(req: NextRequest) {
  try {
    // validate header
    validateHeader(req.headers);
    // validate body
    const body = registrationSchema.parse(await req.json());

    // prepare createdAccount and createdUser to be used for sending registration email
    let createdAccount;
    let createdUser;

    /**
     * Create Account and associated User/Employee in a transaction
     * This ensures that either both records are created or none at all
     */
    const result = await prisma.$transaction(async (tx) => {
      const accountInput = convertBodyToAccountInput(body.account);
      const createdAccount = await createAccountTx(accountInput, tx);

      if (createdAccount.type === AccountType.USER) {
        const userInput = convertBodyToUserInput(
          body.entity as z.infer<typeof userRegistrationSchema>,
          createdAccount.id!
        );
        createdUser = await createUserTx(userInput, tx);
      } else if (createdAccount.type === AccountType.EMPLOYEE) {
        const employeeInput = convertBodyToEmployeeInput(
          body.entity as z.infer<typeof employeeRegistrationSchema>,
          createdAccount.id!
        );
        return await createEmployeeTx(employeeInput, tx);
      } else {
        throw new ValidationError('invalidInput', 'type', createdAccount.type);
      }
    });

    // send registration email
    if (createdAccount && createdUser) {
      await sendRegistrationCodeEmail(createdAccount, createdUser);
      result = createdUser;
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      handleValidationError(error);
    } else {
      return NextResponse.json(
        { message: 'Creation failed: ' + (error as Error).message },
        { status: 400 }
      );
    }
  }
}

function convertBodyToAccountInput(body: z.infer<typeof accountSchema>): AccountCreateInput {
  return {
    email: body.email,
    password: body.password,
    type: body.type,
  };
}

function convertBodyToUserInput(
  body: z.infer<typeof userRegistrationSchema>,
  accountId: string
): UserUncheckedCreateInput {
  return {
    accountId: accountId,
    firstname: body.firstname,
    lastname: body.lastname,
    title: body.title ?? null,
    gender: body.gender,
    genderText: body.genderText ?? null,
    pronoun: body.pronoun,
    pronounText: body.pronounText ?? null,
    birthdate: new Date(body.birthdate),
    country: body.country ?? null,
    city: body.city ?? null,
    zipCode: body.zipCode ?? null,
    street: body.street ?? null,
    houseNumber: body.houseNumber ?? null,
    phone: body.phone ?? null,
  };
}

function convertBodyToEmployeeInput(
  body: z.infer<typeof employeeRegistrationSchema>,
  accountId: string
): EmployeeUncheckedCreateInput {
  // Manuelle Checks entfernt, da Zod die Validierung übernimmt
  return {
    accountId: accountId,
    organizationId: body.organizationId,
    firstname: body.firstname,
    lastname: body.lastname,
    title: body.title ?? null,
    email: body.email,
    gender: body.gender,
    genderText: body.genderText ?? null,
    pronoun: body.pronoun,
    pronounText: body.pronounText ?? null,
    phone: body.phone ?? null,
    position: body.position ?? null,
    languages: body.languages,
    expertiseAreas: body.expertiseArea,
  };
}
