import { createValidatorDirective } from '@redwoodjs/graphql-server';
import { requireAuth as applicationRequireAuth } from "..\\..\\lib\\auth";
export const schema = {
  "kind": "Document",
  "definitions": [{
    "kind": "DirectiveDefinition",
    "description": {
      "kind": "StringValue",
      "value": "Use to check whether or not a user is authenticated and is associated\nwith an optional set of roles.",
      "block": true
    },
    "name": {
      "kind": "Name",
      "value": "requireAuth"
    },
    "arguments": [{
      "kind": "InputValueDefinition",
      "name": {
        "kind": "Name",
        "value": "roles"
      },
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }],
    "repeatable": false,
    "locations": [{
      "kind": "Name",
      "value": "FIELD_DEFINITION"
    }]
  }],
  "loc": {
    "start": 0,
    "end": 180,
    "source": {
      "body": "\n  \"\"\"\n  Use to check whether or not a user is authenticated and is associated\n  with an optional set of roles.\n  \"\"\"\n  directive @requireAuth(roles: [String]) on FIELD_DEFINITION\n",
      "name": "GraphQL request",
      "locationOffset": {
        "line": 1,
        "column": 1
      }
    }
  }
};

const validate = ({
  directiveArgs
}) => {
  const {
    roles
  } = directiveArgs;
  applicationRequireAuth({
    roles
  });
};

const requireAuth = createValidatorDirective(schema, validate);
export default requireAuth;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjcmVhdGVWYWxpZGF0b3JEaXJlY3RpdmUiLCJyZXF1aXJlQXV0aCIsImFwcGxpY2F0aW9uUmVxdWlyZUF1dGgiLCJzY2hlbWEiLCJ2YWxpZGF0ZSIsImRpcmVjdGl2ZUFyZ3MiLCJyb2xlcyJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2FwaS9zcmMvZGlyZWN0aXZlcy9yZXF1aXJlQXV0aC9yZXF1aXJlQXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ3FsIGZyb20gJ2dyYXBocWwtdGFnJ1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlVmFsaWRhdG9yRGlyZWN0aXZlIH0gZnJvbSAnQHJlZHdvb2Rqcy9ncmFwaHFsLXNlcnZlcidcclxuXHJcbmltcG9ydCB7IHJlcXVpcmVBdXRoIGFzIGFwcGxpY2F0aW9uUmVxdWlyZUF1dGggfSBmcm9tICdzcmMvbGliL2F1dGgnXHJcblxyXG5leHBvcnQgY29uc3Qgc2NoZW1hID0gZ3FsYFxyXG4gIFwiXCJcIlxyXG4gIFVzZSB0byBjaGVjayB3aGV0aGVyIG9yIG5vdCBhIHVzZXIgaXMgYXV0aGVudGljYXRlZCBhbmQgaXMgYXNzb2NpYXRlZFxyXG4gIHdpdGggYW4gb3B0aW9uYWwgc2V0IG9mIHJvbGVzLlxyXG4gIFwiXCJcIlxyXG4gIGRpcmVjdGl2ZSBAcmVxdWlyZUF1dGgocm9sZXM6IFtTdHJpbmddKSBvbiBGSUVMRF9ERUZJTklUSU9OXHJcbmBcclxuXHJcbmNvbnN0IHZhbGlkYXRlID0gKHsgZGlyZWN0aXZlQXJncyB9KSA9PiB7XHJcbiAgY29uc3QgeyByb2xlcyB9ID0gZGlyZWN0aXZlQXJnc1xyXG4gIGFwcGxpY2F0aW9uUmVxdWlyZUF1dGgoeyByb2xlcyB9KVxyXG59XHJcblxyXG5jb25zdCByZXF1aXJlQXV0aCA9IGNyZWF0ZVZhbGlkYXRvckRpcmVjdGl2ZShzY2hlbWEsIHZhbGlkYXRlKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcmVxdWlyZUF1dGhcclxuIl0sIm1hcHBpbmdzIjoiQUFFQSxTQUFTQSx3QkFBVCxRQUF5QywyQkFBekM7QUFFQSxTQUFTQyxXQUFXLElBQUlDLHNCQUF4QjtBQUVBLE9BQU8sTUFBTUMsTUFBTTtFQUFBO0VBQUE7SUFBQTtJQUFBO01BQUE7TUFBQTtNQUFBO0lBQUE7SUFBQTtNQUFBO01BQUE7SUFBQTtJQUFBO01BQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTtNQUFBO1FBQUE7UUFBQTtVQUFBO1VBQUE7WUFBQTtZQUFBO1VBQUE7UUFBQTtNQUFBO01BQUE7SUFBQTtJQUFBO0lBQUE7TUFBQTtNQUFBO0lBQUE7RUFBQTtFQUFBO0lBQUE7SUFBQTtJQUFBO01BQUE7TUFBQTtNQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7RUFBQTtBQUFBLENBQVo7O0FBUVAsTUFBTUMsUUFBUSxHQUFHLENBQUM7RUFBRUM7QUFBRixDQUFELEtBQXVCO0VBQ3RDLE1BQU07SUFBRUM7RUFBRixJQUFZRCxhQUFsQjtFQUNBSCxzQkFBc0IsQ0FBQztJQUFFSTtFQUFGLENBQUQsQ0FBdEI7QUFDRCxDQUhEOztBQUtBLE1BQU1MLFdBQVcsR0FBR0Qsd0JBQXdCLENBQUNHLE1BQUQsRUFBU0MsUUFBVCxDQUE1QztBQUVBLGVBQWVILFdBQWYifQ==