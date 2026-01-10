import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { ApiClient } from "../client.js";
import type { Person, ImportPeopleResult } from "../types.js";

export const peopleTools: Tool[] = [
  {
    name: "niftygifty_list_people",
    description:
      "List all people (contacts) in the current workspace. These are gift recipients and givers.",
    inputSchema: {
      type: "object",
      properties: {
        relationship: {
          type: "string",
          enum: [
            "family",
            "friends",
            "co-workers",
            "vendors",
            "partners",
            "investors",
          ],
          description: "Filter by relationship category",
        },
      },
      required: [],
    },
  },
  {
    name: "niftygifty_get_person",
    description: "Get details of a specific person.",
    inputSchema: {
      type: "object",
      properties: {
        person_id: {
          type: "number",
          description: "The person ID",
        },
      },
      required: ["person_id"],
    },
  },
  {
    name: "niftygifty_create_person",
    description: "Create a new person/contact for gift tracking.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Person's name",
        },
        email: {
          type: "string",
          description: "Email address (optional)",
        },
        relationship: {
          type: "string",
          description:
            "Relationship category (family, friends, co-workers, etc.)",
        },
        age: {
          type: "number",
          description: "Person's age (optional, helps with gift suggestions)",
        },
        gender: {
          type: "string",
          description: "Gender (optional)",
        },
        notes: {
          type: "string",
          description: "Notes about the person (interests, sizes, etc.)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "niftygifty_update_person",
    description: "Update an existing person's details.",
    inputSchema: {
      type: "object",
      properties: {
        person_id: {
          type: "number",
          description: "The person ID to update",
        },
        name: {
          type: "string",
          description: "New name",
        },
        email: {
          type: "string",
          description: "New email",
        },
        relationship: {
          type: "string",
          description: "New relationship category",
        },
        age: {
          type: "number",
          description: "New age",
        },
        gender: {
          type: "string",
          description: "New gender",
        },
        notes: {
          type: "string",
          description: "New notes",
        },
      },
      required: ["person_id"],
    },
  },
  {
    name: "niftygifty_delete_person",
    description: "Delete a person from the workspace.",
    inputSchema: {
      type: "object",
      properties: {
        person_id: {
          type: "number",
          description: "The person ID to delete",
        },
      },
      required: ["person_id"],
    },
  },
  {
    name: "niftygifty_import_people_csv",
    description:
      "Import people from CSV data. Headers: name,email,relationship,age,gender,notes",
    inputSchema: {
      type: "object",
      properties: {
        csv_content: {
          type: "string",
          description:
            "CSV content with headers: name,email,relationship,age,gender,notes",
        },
      },
      required: ["csv_content"],
    },
  },
];

export async function handlePeopleTool(
  client: ApiClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "niftygifty_list_people": {
      let endpoint = "/people";
      if (args.relationship) {
        endpoint += `?relationship=${args.relationship}`;
      }
      const people = await client.get<Person[]>(endpoint);
      return people;
    }

    case "niftygifty_get_person": {
      const personId = args.person_id as number;
      const person = await client.get<Person>(`/people/${personId}`);
      return person;
    }

    case "niftygifty_create_person": {
      const personData: Record<string, unknown> = {
        name: args.name,
      };
      if (args.email) personData.email = args.email;
      if (args.relationship) personData.relationship = args.relationship;
      if (args.age) personData.age = args.age;
      if (args.gender) personData.gender = args.gender;
      if (args.notes) personData.notes = args.notes;

      const person = await client.post<Person>("/people", {
        person: personData,
      });
      return {
        message: `Created person: ${person.name}`,
        person,
      };
    }

    case "niftygifty_update_person": {
      const personId = args.person_id as number;
      const updateData: Record<string, unknown> = {};
      if (args.name !== undefined) updateData.name = args.name;
      if (args.email !== undefined) updateData.email = args.email;
      if (args.relationship !== undefined)
        updateData.relationship = args.relationship;
      if (args.age !== undefined) updateData.age = args.age;
      if (args.gender !== undefined) updateData.gender = args.gender;
      if (args.notes !== undefined) updateData.notes = args.notes;

      const person = await client.patch<Person>(`/people/${personId}`, {
        person: updateData,
      });
      return {
        message: `Updated person: ${person.name}`,
        person,
      };
    }

    case "niftygifty_delete_person": {
      const personId = args.person_id as number;
      await client.delete(`/people/${personId}`);
      return {
        message: "Person deleted successfully",
      };
    }

    case "niftygifty_import_people_csv": {
      const csvContent = args.csv_content as string;

      // Create FormData with the CSV content
      const formData = new FormData();
      const blob = new Blob([csvContent], { type: "text/csv" });
      formData.append("file", blob, "import.csv");

      const result = await client.postFormData<ImportPeopleResult>(
        "/imports/people",
        formData
      );
      return {
        message: `Imported ${result.created} people (${result.skipped} skipped)`,
        ...result,
      };
    }

    default:
      throw new Error(`Unknown people tool: ${toolName}`);
  }
}
