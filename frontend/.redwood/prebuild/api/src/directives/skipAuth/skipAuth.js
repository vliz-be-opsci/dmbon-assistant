import { createValidatorDirective } from '@redwoodjs/graphql-server';
export const schema = {
  "kind": "Document",
  "definitions": [{
    "kind": "DirectiveDefinition",
    "description": {
      "kind": "StringValue",
      "value": "Use to skip authentication checks and allow public access.",
      "block": true
    },
    "name": {
      "kind": "Name",
      "value": "skipAuth"
    },
    "arguments": [],
    "repeatable": false,
    "locations": [{
      "kind": "Name",
      "value": "FIELD_DEFINITION"
    }]
  }],
  "loc": {
    "start": 0,
    "end": 116,
    "source": {
      "body": "\n  \"\"\"\n  Use to skip authentication checks and allow public access.\n  \"\"\"\n  directive @skipAuth on FIELD_DEFINITION\n",
      "name": "GraphQL request",
      "locationOffset": {
        "line": 1,
        "column": 1
      }
    }
  }
};
const skipAuth = createValidatorDirective(schema, () => {
  return;
});
export default skipAuth;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjcmVhdGVWYWxpZGF0b3JEaXJlY3RpdmUiLCJzY2hlbWEiLCJza2lwQXV0aCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2FwaS9zcmMvZGlyZWN0aXZlcy9za2lwQXV0aC9za2lwQXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ3FsIGZyb20gJ2dyYXBocWwtdGFnJ1xuXG5pbXBvcnQgeyBjcmVhdGVWYWxpZGF0b3JEaXJlY3RpdmUgfSBmcm9tICdAcmVkd29vZGpzL2dyYXBocWwtc2VydmVyJ1xuXG5leHBvcnQgY29uc3Qgc2NoZW1hID0gZ3FsYFxuICBcIlwiXCJcbiAgVXNlIHRvIHNraXAgYXV0aGVudGljYXRpb24gY2hlY2tzIGFuZCBhbGxvdyBwdWJsaWMgYWNjZXNzLlxuICBcIlwiXCJcbiAgZGlyZWN0aXZlIEBza2lwQXV0aCBvbiBGSUVMRF9ERUZJTklUSU9OXG5gXG5cbmNvbnN0IHNraXBBdXRoID0gY3JlYXRlVmFsaWRhdG9yRGlyZWN0aXZlKHNjaGVtYSwgKCkgPT4ge1xuICByZXR1cm5cbn0pXG5cbmV4cG9ydCBkZWZhdWx0IHNraXBBdXRoXG4iXSwibWFwcGluZ3MiOiJBQUVBLFNBQVNBLHdCQUFULFFBQXlDLDJCQUF6QztBQUVBLE9BQU8sTUFBTUMsTUFBTTtFQUFBO0VBQUE7SUFBQTtJQUFBO01BQUE7TUFBQTtNQUFBO0lBQUE7SUFBQTtNQUFBO01BQUE7SUFBQTtJQUFBO0lBQUE7SUFBQTtNQUFBO01BQUE7SUFBQTtFQUFBO0VBQUE7SUFBQTtJQUFBO0lBQUE7TUFBQTtNQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtFQUFBO0FBQUEsQ0FBWjtBQU9QLE1BQU1DLFFBQVEsR0FBR0Ysd0JBQXdCLENBQUNDLE1BQUQsRUFBUyxNQUFNO0VBQ3REO0FBQ0QsQ0FGd0MsQ0FBekM7QUFJQSxlQUFlQyxRQUFmIn0=