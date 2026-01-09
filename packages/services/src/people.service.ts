import type { ApiClient } from "@niftygifty/api-client";
import type { Person, CreatePersonRequest, PersonWithGifts } from "@niftygifty/types";

export interface PeopleService {
  getAll(): Promise<Person[]>;
  getById(id: number): Promise<PersonWithGifts>;
  create(data: CreatePersonRequest["person"]): Promise<Person>;
  update(id: number, data: Partial<CreatePersonRequest["person"]>): Promise<Person>;
  delete(id: number): Promise<void>;
}

export function createPeopleService(client: ApiClient): PeopleService {
  return {
    getAll() {
      return client.get<Person[]>("/people");
    },

    getById(id: number) {
      return client.get<PersonWithGifts>(`/people/${id}`);
    },

    create(data: CreatePersonRequest["person"]) {
      return client.post<Person>("/people", { person: data });
    },

    update(id: number, data: Partial<CreatePersonRequest["person"]>) {
      return client.patch<Person>(`/people/${id}`, { person: data });
    },

    delete(id: number) {
      return client.delete(`/people/${id}`);
    },
  };
}
