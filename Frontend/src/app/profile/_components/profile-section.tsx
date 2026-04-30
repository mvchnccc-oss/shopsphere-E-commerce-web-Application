"use client";
import ErrorBox from "@/components/error-box";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { becomeSellerAction, updateProfileAction } from "@/lib/actions/profile.actions";
import { GetProfileResponse } from "@/lib/interfaces/profile.interface";
import { UpdateProfileForm, updateProfileSchema } from "@/lib/validations/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MailIcon,
  UserIcon,
  StoreIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  PackageIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  AlertCircleIcon, // ضفت أيقونة للتنبيه
  XIcon,           // أيقونة قفل
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProfileField from "./profile-field";

interface ProfileSectionProps {
  data: GetProfileResponse | null;
}

type Tab = "profile" | "seller";

const sellerPerks = [
  {
    icon: PackageIcon,
    title: "List Your Products",
    desc: "Upload and manage your own products visible to all buyers.",
  },
  {
    icon: TrendingUpIcon,
    title: "Track Your Sales",
    desc: "Access your seller dashboard with live revenue and order stats.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Trusted Platform",
    desc: "Sell confidently with ShopSphere's buyer-seller protection.",
  },
];

export default function ProfileSection(props: ProfileSectionProps) {
  const [data, setData] = useState(props.data);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isEditMode, setEditMode] = useState(false);
  const [isPending, setPending] = useState(false);
  const [isBecomingPending, setBecomingPending] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();
  const [sellerSuccess, setSellerSuccess] = useState(false);
  
  // --- ضيف الـ State دي هنا ---
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { update: updateSession } = useSession();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: data?.name ?? "",
      email: data?.email ?? "",
    },
  });

  useEffect(() => {
    if (data) form.reset(data);
  }, [isEditMode, data]);

  async function handleSubmit(formData: UpdateProfileForm) {
    setPending(true);
    try {
      const body = await updateProfileAction(formData);
      if (!body.success) {
        setServerError(body.message);
        return;
      }
      setEditMode(false);
      setData((prev) => prev ? { ...prev, ...formData } : prev);
      setServerError(undefined);
    } catch {
    } finally {
      setPending(false);
    }
  }

  async function handleBecomeSeller() {
    setBecomingPending(true);
    setServerError(undefined);
    setShowConfirmModal(false); // اقفل المودال لما العملية تبدأ
    try {
      const result = await becomeSellerAction();
      if (!result.success) {
        setServerError(result.message);
        return;
      }
      await updateSession({ isSeller: true, token: result.token });
      setData((prev) => prev ? { ...prev, isSeller: true } : prev);
      setSellerSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1800);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setBecomingPending(false);
    }
  }

  const isSeller = data?.isSeller ?? false;

  return (
    <div className="p-4 min-h-[60vh]">
      <div className="mx-auto mt-5 w-full max-w-md">
        {/* Tab Bar */}
        <div className="flex rounded-xl border border-border bg-muted/40 p-1 mb-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserIcon className="size-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("seller")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "seller"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <StoreIcon className="size-4" />
            {isSeller ? "Seller" : "Become a Seller"}
            {isSeller && (
              <span className="ml-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                Active
              </span>
            )}
          </button>
        </div>

        {/* ─── PROFILE TAB ─── */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader className="flex flex-col items-center">
              <div className="bg-accent p-2 shadow-md rounded-lg mb-2">
                <UserIcon className="size-10" />
              </div>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Profile</CardTitle>
                {data && (
                  <CardAction>
                    {!isEditMode && (
                      <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                        Edit
                      </Button>
                    )}
                  </CardAction>
                )}
              </div>
              <CardDescription className="self-start">Your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-6"
                onSubmit={form.handleSubmit(handleSubmit)}
                noValidate
                id="profile-form"
              >
                {data && (
                  <>
                    <ProfileField
                      id="name-field"
                      isEdit={isEditMode}
                      label={<><UserIcon /> Name</>}
                      registeration={form.register("name")}
                      textValue={data.name}
                      error={form.formState.errors["name"]?.message}
                    />
                    <ProfileField
                      id="email-field"
                      isEdit={isEditMode}
                      label={<><MailIcon /> Email</>}
                      registeration={form.register("email")}
                      textValue={data.email}
                      error={form.formState.errors["email"]?.message}
                    />
                  </>
                )}
                {!data && <ErrorBox>User is unauthenticated</ErrorBox>}
                {serverError && <ErrorBox>{serverError}</ErrorBox>}
              </form>
            </CardContent>
            <CardFooter className="ml-auto">
              {isEditMode && (
                <>
                  <Button className="mr-2" type="submit" form="profile-form" disabled={isPending}>
                    Save changes{isPending && "..."}
                  </Button>
                  <Button variant="secondary" onClick={() => setEditMode(false)} type="button">
                    Cancel
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        )}

        {/* ─── SELLER TAB ─── */}
        {activeTab === "seller" && (
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <div
                className={`p-3 rounded-xl mb-2 shadow-md ${
                  isSeller
                    ? "bg-emerald-100 dark:bg-emerald-900"
                    : "bg-accent"
                }`}
              >
                <StoreIcon
                  className={`size-10 ${isSeller ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                />
              </div>
              <CardTitle>
                {isSeller ? "You're a Seller 🎉" : "Start Selling on ShopSphere"}
              </CardTitle>
              <CardDescription>
                {isSeller
                  ? "Your seller account is active. Head to your dashboard to manage products and view your stats."
                  : "Join thousands of sellers and start earning today."}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {isSeller ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2Icon className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                      Seller status is active on your account
                    </p>
                  </div>
                  <Button
                    className="w-full flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => router.push("/dashboard")}
                  >
                    Go to Dashboard
                    <ArrowRightIcon className="size-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3">
                    {sellerPerks.map(({ icon: Icon, title, desc }) => (
                      <div
                        key={title}
                        className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/30"
                      >
                        <div className="p-1.5 rounded-lg bg-background border border-border shrink-0">
                          <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {serverError && <ErrorBox>{serverError}</ErrorBox>}

                  {sellerSuccess ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2Icon className="size-5 text-emerald-600 shrink-0" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                        You're now a seller! Redirecting to dashboard...
                      </p>
                    </div>
                  ) : (
                    // --- عدلنا الزرار هنا عشان يفتح المودال ---
                    <Button
                      className="w-full flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => setShowConfirmModal(true)} 
                      disabled={isBecomingPending}
                    >
                      <StoreIcon className="size-4" />
                      {isBecomingPending ? "Activating..." : "Become a Seller"}
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* ─── CONFIRMATION MODAL ─── */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card border border-border w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-lg">
                    <AlertCircleIcon className="size-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                  >
                    <XIcon className="size-5 text-muted-foreground" />
                  </button>
                </div>

                <h3 className="text-lg font-bold mb-2">Become a Seller?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Are you sure you want to activate seller mode? You'll be able to list products and manage your own store.
                </p>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" 
                    onClick={handleBecomeSeller}
                  >
                    Yes, Activate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}