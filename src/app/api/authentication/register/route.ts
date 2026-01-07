import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import { Areas, Role } from '~/generated/prisma/enums';
import type {
  AccountCreateInput,
  EmployeeUncheckedCreateInput,
  UserUncheckedCreateInput,
} from '~/generated/prisma/models';

import { createAccountTx } from '../../account/services';
import { sendRegistrationCodeEmail } from '../../email/service';
import { createEmployeeTx } from '../../employee/services';
import { handleValidationError, headerSchema } from '../../helper';
import { createUserTx } from '../../user/services';

const registrationSchema = z.object({
  email: z.string().min(5), // TODO: add email regex validation and mybe move to helper file
  password: z.string().min(6), // TODO: ask what our password policy should be
  role: z.enum(Role),
  name: z.string(), // TODO: potentially extend for surname, first name
  phone: z.string().optional(), // TODO: add phone regex validation and mybe move to helper file
  address: z.string().optional(), // TODO: potentially extend for street, city, zip, country
  organizationId: z.string().optional(), // only for EMPLOYEE registration
  position: z.string().optional(), // only for EMPLOYEE registration
  expertiseArea: z.array(z.enum(Areas)).optional(), // only for EMPLOYEE registration
});

export async function POST(req: NextRequest) {
  try {
    // validate header
    headerSchema.parse(req.headers);

    // validate body
    const body = registrationSchema.parse(await req.json());

    /**
     * Create Account and associated User/Employee in a transaction
     * This ensures that either both records are created or none at all
     */
    const result = await prisma.$transaction(async (tx) => {
      const accountInput = convertBodyToAccountInput(body);
      const createdAccount = await createAccountTx(accountInput, tx);

      if (createdAccount.role === Role.USER) {
        const userInput = convertBodyToUserInput(body, createdAccount.id!);
        // TODO: change to userInput.firstName, userInput.lastName when schema is updated
        sendRegistrationCodeEmail(userInput.name, userInput.name, createdAccount.email);
        return await createUserTx(userInput, tx);
      } else if (createdAccount.role === Role.EMPLOYEE) {
        const employeeInput = convertBodyToEmployeeInput(body, createdAccount.id!);
        return await createEmployeeTx(employeeInput, tx);
      } else {
        throw new ValidationError('invalidInput', 'role', createdAccount.role);
      }
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
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

function convertBodyToAccountInput(body: z.infer<typeof registrationSchema>): AccountCreateInput {
  return {
    email: body.email,
    password: body.password,
    role: body.role,
  };
}

function convertBodyToUserInput(
  body: z.infer<typeof registrationSchema>,
  accountId: string
): UserUncheckedCreateInput {
  return {
    accountId: accountId,
    name: body.name,
    phone: body.phone ?? null,
    address: body.address ?? null,
  };
}

function convertBodyToEmployeeInput(
  body: z.infer<typeof registrationSchema>,
  accountId: string
): EmployeeUncheckedCreateInput {
  if (!body.organizationId) {
    throw new ValidationError('invalidInput', 'organizationId', body.organizationId);
  } else if (body.expertiseArea?.length === 0) {
    throw new ValidationError('invalidInput', 'expertiseArea', body.expertiseArea);
  }
  return {
    accountId: accountId,
    organizationId: body.organizationId,
    name: body.name,
    phone: body.phone ?? undefined,
    position: body.position ?? undefined,
    expertiseArea: body.expertiseArea ?? undefined,
  };
}
