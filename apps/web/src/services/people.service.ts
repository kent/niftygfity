import { apiClient } from "@/lib/api-client";
import type { Person, PersonWithGifts, CreatePersonRequest } from "@niftygifty/types";

class PeopleService {
  async getAll(): Promise<Person[]> {
    return apiClient.get<Person[]>("/people");
  }

  async getById(id: number): Promise<Person> {
    return apiClient.get<Person>(`/people/${id}`);
  }

  async getWithGifts(id: number): Promise<PersonWithGifts> {
    return apiClient.get<PersonWithGifts>(`/people/${id}?include=gifts`);
  }

  async create(data: CreatePersonRequest["person"]): Promise<Person> {
    return apiClient.post<Person>("/people", { person: data });
  }

  async update(
    id: number,
    data: Partial<CreatePersonRequest["person"]>
  ): Promise<Person> {
    return apiClient.patch<Person>(`/people/${id}`, { person: data });
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`/people/${id}`);
  }
}

export const peopleService = new PeopleService();

