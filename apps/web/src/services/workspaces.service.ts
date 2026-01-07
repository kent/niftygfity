import { apiClient } from "@/lib/api-client";
import type {
  Workspace,
  WorkspaceWithMembers,
  WorkspaceMember,
  WorkspaceInvite,
  WorkspaceInviteDetails,
  CompanyProfile,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  CreateWorkspaceInviteRequest,
  CreateWorkspaceInviteResponse,
  UpdateWorkspaceMembershipRequest,
  UpdateCompanyProfileRequest,
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
}

export const workspacesService = new WorkspacesService();
