const { test, expect, request } = require('@playwright/test');

const {
  REQRES_API_KEY,
  REQRES_BASE_URL,
  REQRES_COLLECTION,
  REQRES_ENV,
  REQRES_PROJECT_ID,
} = process.env;

test
  .describe('ReqRes persistent collection', () => {
    const allPresent = [REQRES_API_KEY, REQRES_BASE_URL, REQRES_COLLECTION, REQRES_ENV, REQRES_PROJECT_ID]
      .every(v => typeof v === 'string' && v.length > 0);

    test.skip(!allPresent, 'Skipping API tests — one or more REQRES_* env vars are missing');

    const collection = REQRES_COLLECTION;
    const projectId = REQRES_PROJECT_ID;

    const collectionPath = `/api/collections/${collection}/records?project_id=${projectId}`;
    const recordPath = (id) => `/api/collections/${collection}/records/${id}?project_id=${projectId}`;

    /** @type {import('@playwright/test').APIRequestContext} */
    let apiContext;
    /** @type {string | undefined} */
    let userId;

    test.beforeAll(async () => {
      apiContext = await request.newContext({
        baseURL: REQRES_BASE_URL,
        extraHTTPHeaders: {
          'x-api-key': REQRES_API_KEY,
          'X-Reqres-Env': REQRES_ENV,
          'Content-Type': 'application/json',
        },
      });
    });

    test.afterAll(async () => {
      if (apiContext) {
        await apiContext.dispose();
      }
    });

    test('Create, fetch, update, and validate a ReqRes user', async () => {
      try {
        await test.step('Create user', async () => {
          const payload = {
            data: {
              name: 'Vishakha',
              job: 'QA Engineer',
            },
          };
          const response = await apiContext.post(collectionPath, { data: payload });
          expect(response.status()).toBe(201);

          const body = await response.json();
          expect(body.data, 'response.data should contain the created record').toBeTruthy();
          expect(typeof body.data.id).toBe('string');
          expect(body.data.id.length).toBeGreaterThan(0);
          expect(body.data.data.name).toBe('Vishakha');
          expect(body.data.data.job).toBe('QA Engineer');

          userId = body.data.id;
        });

        await test.step('Fetch and validate created user', async () => {
          test.fail(!userId, 'userId was not stored after Create step');
          const response = await apiContext.get(recordPath(userId));
          expect(response.status()).toBe(200);

          const body = await response.json();
          expect(body.data.id).toBe(userId);
          expect(body.data.data.name).toBe('Vishakha');
          expect(body.data.data.job).toBe('QA Engineer');
        });

        await test.step('Update user name', async () => {
          test.fail(!userId, 'userId was not stored after Create step');
          const payload = {
            data: {
              name: 'Vishakha Gupta',
              job: 'Senior QA Engineer',
            },
          };
          const response = await apiContext.put(recordPath(userId), { data: payload });
          expect(response.status()).toBe(200);

          const body = await response.json();
          expect(body.data.id).toBe(userId);
          expect(body.data.data.name).toBe('Vishakha Gupta');
          expect(body.data.data.job).toBe('Senior QA Engineer');
        });

        await test.step('Fetch and validate updated user', async () => {
          test.fail(!userId, 'userId was not stored after Create step');
          const response = await apiContext.get(recordPath(userId));
          expect(response.status()).toBe(200);

          const body = await response.json();
          expect(body.data.id).toBe(userId);
          expect(body.data.data.name).toBe('Vishakha Gupta');
          expect(body.data.data.job).toBe('Senior QA Engineer');
        });
      } finally {
        await test.step('Delete test user', async () => {
          if (!userId) return;
          const response = await apiContext.delete(recordPath(userId));
          expect(response.status()).toBe(204);
          userId = undefined;
        });
      }
    });
  });
