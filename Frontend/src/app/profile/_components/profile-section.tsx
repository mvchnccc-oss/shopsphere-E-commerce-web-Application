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
import { updateProfileAction } from "@/lib/actions/profile.actions";
import { GetProfileResponse } from "@/lib/interfaces/profile.interface";
import { UpdateProfileForm, updateProfileSchema } from "@/lib/validations/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ProfileField from "./profile-field";

interface ProfileSectionProps {
  data: GetProfileResponse | null;
}

export default function ProfileSection(props: ProfileSectionProps) {
  const [data, setData] = useState(props.data);
  const [isEditMode, setEditMode] = useState(false);
  const [isPending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();

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

  async function handleSubmit(data: UpdateProfileForm) {
    setPending(true);
    try {
      const body = await updateProfileAction(data);
      if (!body.success) {
        setServerError(body.message);
        return;
      }

      // TODO: Use the token somehow
      const token = body.token;

      setEditMode(false);
      setData(data);
      setServerError(undefined);
    } catch (error) {
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="p-2">
      <Card className="mx-auto mt-5 w-full max-w-md">
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
                  label={
                    <>
                      <UserIcon /> Name
                    </>
                  }
                  registeration={form.register("name")}
                  textValue={data.name}
                  error={form.formState.errors["name"]?.message}
                />
                <ProfileField
                  id="name-field"
                  isEdit={isEditMode}
                  label={
                    <>
                      <MailIcon />
                      Email
                    </>
                  }
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
    </div>
  );
}
