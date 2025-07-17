drop policy "Enable delete for users based on user_id" on "public"."projects";

create table "public"."files" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "name" text not null,
    "path" text not null,
    "content" text not null,
    "storage_path" text not null,
    "file_type" text not null,
    "mime_type" text not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."files" enable row level security;

alter table "public"."projects" add column "description" text;

CREATE UNIQUE INDEX files_pkey ON public.files USING btree (id);

alter table "public"."files" add constraint "files_pkey" PRIMARY KEY using index "files_pkey";

alter table "public"."files" add constraint "files_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."files" validate constraint "files_project_id_fkey";

grant delete on table "public"."files" to "anon";

grant insert on table "public"."files" to "anon";

grant references on table "public"."files" to "anon";

grant select on table "public"."files" to "anon";

grant trigger on table "public"."files" to "anon";

grant truncate on table "public"."files" to "anon";

grant update on table "public"."files" to "anon";

grant delete on table "public"."files" to "authenticated";

grant insert on table "public"."files" to "authenticated";

grant references on table "public"."files" to "authenticated";

grant select on table "public"."files" to "authenticated";

grant trigger on table "public"."files" to "authenticated";

grant truncate on table "public"."files" to "authenticated";

grant update on table "public"."files" to "authenticated";

grant delete on table "public"."files" to "service_role";

grant insert on table "public"."files" to "service_role";

grant references on table "public"."files" to "service_role";

grant select on table "public"."files" to "service_role";

grant trigger on table "public"."files" to "service_role";

grant truncate on table "public"."files" to "service_role";

grant update on table "public"."files" to "service_role";

create policy "Enable full access to files if user owns the project"
on "public"."files"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = files.project_id) AND (projects.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = files.project_id) AND (projects.user_id = auth.uid())))));


create policy "Enable full access for users based on user_id"
on "public"."projects"
as permissive
for all
to authenticated
using ((auth.uid() = user_id))
with check (true);



