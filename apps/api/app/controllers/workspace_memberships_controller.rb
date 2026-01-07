# frozen_string_literal: true

class WorkspaceMembershipsController < ApplicationController
  before_action :set_workspace
  before_action :require_admin
  before_action :set_membership, only: [ :update, :destroy ]

  def index
    memberships = @workspace.workspace_memberships.includes(:user)
    render json: WorkspaceMembershipBlueprint.render(memberships)
  end

  def update
    if @membership.update(membership_params)
      render json: WorkspaceMembershipBlueprint.render(@membership)
    else
      render json: { errors: @membership.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @membership.destroy
      head :no_content
    else
      render json: { errors: @membership.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_workspace
    @workspace = current_user.workspaces.find(params[:workspace_id])
  end

  def require_admin
    render json: { error: "Access denied" }, status: :forbidden unless @workspace.admin?(current_user)
  end

  def set_membership
    @membership = @workspace.workspace_memberships.find(params[:id])
  end

  def membership_params
    params.require(:workspace_membership).permit(:role)
  end
end
