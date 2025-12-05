"use client";

import { useState, useEffect } from "react";
import type { User } from "@niftygifty/types";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Mail, Lock, Shield, Eye, EyeOff, Pencil, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usersService } from "@/services";

interface ProfileSectionProps {
  user: User | null;
  onUpdatePassword?: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const { user: clerkUser } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [isSaving, setIsSaving] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Sync form state when user changes
  useEffect(() => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
  }, [user?.first_name, user?.last_name]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkUser) return;

    setIsSaving(true);
    try {
      // Update in Clerk (source of truth)
      await clerkUser.update({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      // Sync to backend for collaboration features
      await usersService.syncProfile();
      toast.success("Profile updated");
      setIsEditingName(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setIsEditingName(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Password change not yet implemented in backend
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
            <UserIcon className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Profile</h2>
            <p className="text-slate-400 text-sm">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Name Card */}
      <div className="group relative rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg hover:shadow-violet-500/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 shrink-0">
              <UserIcon className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex-1">
              {!isEditingName ? (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500 block mb-1">
                      Name
                    </span>
                    <p className="text-lg font-medium text-white">
                      {user?.first_name || user?.last_name
                        ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
                        : "Not set"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingName(true)}
                    className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all duration-200"
                  >
                    <Pencil className="h-4 w-4 mr-1.5" />
                    Edit
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500 block mb-4">
                    Edit Name
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-slate-300 text-sm">
                        First Name
                      </Label>
                      <Input
                        id="first-name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-white focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-slate-300 text-sm">
                        Last Name
                      </Label>
                      <Input
                        id="last-name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-white focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="flex-1 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <X className="h-4 w-4 mr-1.5" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 disabled:shadow-none disabled:opacity-50 transition-all duration-200"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-1.5" />
                      )}
                      Save
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Card */}
      <div className="group relative rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg hover:shadow-violet-500/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 shrink-0">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email Address
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Shield className="h-3 w-3 text-emerald-400" />
                  <span className="text-[10px] font-medium text-emerald-400">Verified</span>
                </div>
              </div>
              <p className="text-lg font-medium text-white truncate">
                {user?.email || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Card */}
      <div className="group relative rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg hover:shadow-violet-500/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 shrink-0">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex-1">
              {!isChangingPassword ? (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500 block mb-1">
                      Password
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-slate-600" />
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangingPassword(true)}
                    className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all duration-200"
                  >
                    Change Password
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Change Password
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {showPasswords ? "Hide" : "Show"}
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-slate-300 text-sm">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-slate-300 text-sm">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                      placeholder="Enter your new password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-slate-300 text-sm">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                      placeholder="Confirm your new password"
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">Passwords don&apos;t match</p>
                    )}
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      className="flex-1 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                      className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 disabled:shadow-none disabled:opacity-50 transition-all duration-200"
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
