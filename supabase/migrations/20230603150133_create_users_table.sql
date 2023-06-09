create table "public"."users" (
    "id" bigint generated by default as identity not null,
    "uuid" uuid not null,
    "created_at" timestamp with time zone default now()
);


CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";