import { NextRequest } from 'next/server';

import { DELETE, GET, PATCH, POST } from '@/app/api/organization/[organizationID]/route';
import { prisma } from '@/lib/db';
import type { OrganizationCreateInput } from '~/generated/prisma/models';

jest.mock('@/services/openRouter/vectorizer', () => ({
    vectorizeExpertiseArea: jest.fn(async () => Array(3072).fill(0.01)),
}));

describe('Organization Routen teset', () => {
    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/organization/[organizationID]/`;
    let createdOrgId: string;

    test('POST Organization', async () => {
        const organization: OrganizationCreateInput = {
            name: 'Max Mustermann Kanzlei',
            description: 'Kanzlei test',
            email: Math.random() + '@mail.de',
            type: 'LAW_FIRM',
            expertiseArea: ['Verkehrsrecht', 'Arbeitsrecht'],
        };

        const req = new NextRequest(baseUrl, {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(organization),
        });

        const res = await POST(req);
        expect(res.status).toBe(201);
        createdOrgId = (await res.json()).id;
    });

    test('GET Organization', async () => {
        const req = new NextRequest(baseUrl);
        const res = await GET(req, { params: Promise.resolve({ organizationID: createdOrgId }) });
        const json = await res.json();
        expect(json.length).not.toBe(0);
        expect(res.status).toBe(200);
    });

    test('PATCH Organization', async () => {
        const getReq = new NextRequest(baseUrl);
        const getRes = await GET(getReq, { params: Promise.resolve({ organizationID: createdOrgId }) });
        const getJSON = await getRes.json();

        expect(getJSON.length).not.toBe(0);
        expect(getRes.status).toBe(200);

        const organization: OrganizationCreateInput = {
            id: getJSON.id,
            name: 'updated',
            description: 'Kanzlei test',
            email: Math.random() + '@mail.de',
            type: 'LAW_FIRM',
            expertiseArea: ['Verkehrsrecht', 'Arbeitsrecht'],
        };

        const patchReq = new NextRequest(baseUrl, {
            headers: { 'content-type': 'application/json' },
            method: 'PATCH',
            body: JSON.stringify(organization),
        });

        const res = await PATCH(patchReq);

        const updated = await prisma.organization.findFirst({
            where: { name: 'updated' },
        });

        expect(updated?.name).toBe('updated');
        expect(res.status).toBe(200);
    });

    test('DELETE Organization', async () => {
        const getReq = new NextRequest(baseUrl);
        const res = await DELETE(getReq, { params: Promise.resolve({ organizationID: createdOrgId }) });
        expect(res.status).toBe(200);
    });
});
