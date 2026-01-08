import { apiClient } from "@/lib/api-client";
import type {
  Workspace,
  WorkspaceWithMembers,
  WorkspaceMember,
  WorkspaceInvite,
  WorkspaceInviteDetails,
  CompanyProfile,
  Address,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  CreateWorkspaceInviteRequest,
  CreateWorkspaceInviteResponse,
  UpdateWorkspaceMembershipRequest,
  UpdateCompanyProfileRequest,
  CreateAddressRequest,
  UpdateAddressRequest,
  WorkspaceRole,
} from "@niftygifty/types";

class WorkspacesService {
  // Workspaces
  async getAll(): Promise<Workspace[]> {
    return apiClient.get<Workspace[]>("/workspaces");
  }

  async getById(id: number): Promise<WorkspaceWithMembers> {
    return apiClient.get<WorkspaceWithMembers>(`/workspaces/${id}`);
  }

  async create(data: CreateWorkspaceRequest): Promise<Workspace> {
    return apiClient.post<Workspace>("/workspaces", data);
  }

  async update(id: number, data: UpdateWorkspaceRequest): Promise<Workspace> {
    return apiClient.patch<Workspace>(`/workspaces/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`/workspaces/${id}`);
  }

  // Members
  async getMembers(workspaceId: number): Promise<WorkspaceMember[]> {
    return apiClient.get<WorkspaceMember[]>(
      `/workspaces/${workspaceId}/memberships`
    );
  }

  async updateMember(
    workspaceId: number,
    membershipId: number,
    role: WorkspaceRole
  ): Promise<WorkspaceMember> {
    const data: UpdateWorkspaceMembershipRequest = {
      workspace_membership: { role },
    };
    return apiClient.patch<WorkspaceMember>(
      `/workspaces/${workspaceId}/memberships/${membershipId}`,
      data
    );
  }

  async removeMember(workspaceId: number, membershipId: number): Promise<void> {
    return apiClient.delete(
      `/workspaces/${workspaceId}/memberships/${membershipId}`
    );
  }

  // Invites
  async getInvites(workspaceId: number): Promise<WorkspaceInvite[]> {
    return apiClient.get<WorkspaceInvite[]>(
      `/workspaces/${workspaceId}/invites`
    );
  }

  async createInvite(
    workspaceId: number,
    data?: CreateWorkspaceInviteRequest
  ): Promise<CreateWorkspaceInviteResponse> {
    return apiClient.post<CreateWorkspaceInviteResponse>(
      `/workspaces/${workspaceId}/invites`,
      data || {}
    );
  }

  async regenerateInvite(
    workspaceId: number,
    role?: WorkspaceRole
  ): Promise<CreateWorkspaceInviteResponse> {
    return apiClient.post<CreateWorkspaceInviteResponse>(
      `/workspaces/${workspaceId}/invites/regenerate`,
      { role }
    );
  }

  // Public invite endpoints
  async getInviteDetails(token: string): Promise<WorkspaceInviteDetails> {
    return apiClient.get<WorkspaceInviteDetails>(`/workspace_invite/${token}`);
  }

  async acceptInvite(token: string): Promise<Workspace> {
    return apiClient.post<Workspace>(`/workspace_invite/${token}/accept`);
  }

  // Company Profile
  async getCompanyProfile(workspaceId: number): Promise<CompanyProfile> {
    return apiClient.get<CompanyProfile>(
      `/workspaces/${workspaceId}/company_profile`
    );
  }

  async updateCompanyProfile(
    workspaceId: number,
    data: UpdateCompanyProfileRequest
  ): Promise<CompanyProfile> {
    return apiClient.patch<CompanyProfile>(
      `/workspaces/${workspaceId}/company_profile`,
      data
    );
  }

  // Addresses
  async getAddresses(workspaceId: number): Promise<Address[]> {
    return apiClient.get<Address[]>(`/workspaces/${workspaceId}/addresses`);
  }

  async getAddress(workspaceId: number, addressId: number): Promise<Address> {
    return apiClient.get<Address>(
      `/workspaces/${workspaceId}/addresses/${addressId}`
    );
  }

  async createAddress(
    workspaceId: number,
    data: CreateAddressRequest
  ): Promise<Address> {
    return apiClient.post<Address>(
      `/workspaces/${workspaceId}/addresses`,
      data
    );
  }

  async updateAddress(
    workspaceId: number,
    addressId: number,
    data: UpdateAddressRequest
  ): Promise<Address> {
    return apiClient.patch<Address>(
      `/workspaces/${workspaceId}/addresses/${addressId}`,
      data
    );
  }

  async deleteAddress(workspaceId: number, addressId: number): Promise<void> {
    return apiClient.delete(
      `/workspaces/${workspaceId}/addresses/${addressId}`
    );
  }

  async setDefaultAddress(
    workspaceId: number,
    addressId: number
  ): Promise<Address> {
    return apiClient.post<Address>(
      `/workspaces/${workspaceId}/addresses/${addressId}/set_default`
    );
  }
}

export const workspacesService = new WorkspacesService();
