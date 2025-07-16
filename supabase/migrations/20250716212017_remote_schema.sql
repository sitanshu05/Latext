alter table "public"."projects" add column "user_id" uuid not null;

alter table "public"."projects" enable row level security;

alter table "public"."projects" add constraint "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_user_id_fkey";

create policy "Enable delete for users based on user_id"
on "public"."projects"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check (true);



