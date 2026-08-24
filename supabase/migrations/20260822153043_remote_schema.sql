set local check_function_bodies = off;

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "service_role";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to public;

alter default privileges for role "postgres" in schema "public" revoke all on tables from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "service_role";

revoke all on schema "public" from public;

revoke all on schema "public" from "pg_database_owner";

comment on schema "public" is null;

create extension "hypopg" schema "extensions";

create extension "index_advisor" schema "extensions";

create table "public"."abrigados" (
  "id"         uuid                     not null default extensions.uuid_generate_v4(),
  "abrigo_id"  uuid                     not null,
  "nome"       text                     not null,
  "idade"      integer,
  "created_at" timestamp with time zone not null default now(),
  constraint "abrigados_idade_check" check (((idade >= 0) AND (idade <= 150))),
  constraint "abrigados_pkey" primary key (id)
);

alter table "public"."abrigados"
  enable row level security;

create table "public"."abrigo_itens_urgentes" (
  "id"         uuid                     not null default extensions.uuid_generate_v4(),
  "abrigo_id"  uuid                     not null,
  "item"       text                     not null,
  "created_at" timestamp with time zone not null default now(),
  constraint "abrigo_itens_urgentes_pkey" primary key (id)
);

alter table "public"."abrigo_itens_urgentes"
  enable row level security;

create table "public"."abrigos" (
  "id"         uuid                     not null default extensions.uuid_generate_v4(),
  "evento_id"  uuid                     not null,
  "nome"       text                     not null,
  "endereco"   text                     not null,
  "contato"    text,
  "foto_url"   text,
  "created_by" uuid,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  constraint "abrigos_pkey" primary key (id)
);

alter table "public"."abrigos"
  enable row level security;

create table "public"."doacao_itens_urgentes" (
  "id"         uuid                     not null default extensions.uuid_generate_v4(),
  "evento_id"  uuid                     not null,
  "item"       text                     not null,
  "created_by" uuid,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  constraint "doacao_itens_urgentes_pkey" primary key (id)
);

alter table "public"."doacao_itens_urgentes"
  enable row level security;

create table "public"."eventos" (
  "id"          uuid                     not null default extensions.uuid_generate_v4(),
  "nome"        text                     not null,
  "descricao"   text,
  "localidade"  text                     not null,
  "estado"      character(2)             not null,
  "latitude"    double precision,
  "longitude"   double precision,
  "data_inicio" timestamp with time zone not null default now(),
  "data_fim"    timestamp with time zone,
  "criado_por"  uuid,
  "created_at"  timestamp with time zone not null default now(),
  "updated_at"  timestamp with time zone not null default now(),
  "slug"        text                     not null,
  constraint "eventos_pkey" primary key (id),
  constraint "eventos_slug_unique" unique (slug)
);

alter table "public"."eventos"
  enable row level security;

create table "public"."locais_doacao" (
  "id"         uuid                     not null default extensions.uuid_generate_v4(),
  "evento_id"  uuid                     not null,
  "nome"       text                     not null,
  "endereco"   text                     not null,
  "contato"    text,
  "foto_url"   text,
  "created_by" uuid,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  constraint "locais_doacao_pkey" primary key (id)
);

alter table "public"."locais_doacao"
  enable row level security;

create table "public"."noticias" (
  "id"           uuid                     not null default extensions.uuid_generate_v4(),
  "evento_id"    uuid                     not null,
  "titulo"       text                     not null,
  "texto"        text                     not null,
  "fonte"        text,
  "publicado_em" timestamp with time zone not null default now(),
  "created_by"   uuid,
  "created_at"   timestamp with time zone not null default now(),
  "updated_at"   timestamp with time zone not null default now(),
  constraint "noticias_pkey" primary key (id)
);

alter table "public"."noticias"
  enable row level security;

create table "public"."profiles" (
  "id"         uuid                     not null,
  "name"       text                     not null,
  "email"      text                     not null,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  "avatar_url" text,
  constraint "profiles_pkey" primary key (id)
);

alter table "public"."profiles"
  enable row level security;

create table "public"."vias_interditadas" (
  "id"                   uuid                     not null default extensions.uuid_generate_v4(),
  "evento_id"            uuid                     not null,
  "endereco"             text                     not null,
  "motivo"               text,
  "latitude"             double precision,
  "longitude"            double precision,
  "ativa"                boolean                  not null default true,
  "created_by"           uuid,
  "created_at"           timestamp with time zone not null default now(),
  "updated_at"           timestamp with time zone not null default now(),
  "google_maps_place_id" text,
  constraint "vias_interditadas_pkey" primary key (id)
);

alter table "public"."vias_interditadas"
  enable row level security;

create type "public"."evento_status_enum" as enum (
  'ativo',
  'encerrado',
  'monitoramento'
);

alter table "public"."eventos"
  add column "status" public.evento_status_enum not null default 'ativo'::public.evento_status_enum;

create type "public"."evento_tipo_enum" as enum (
  'enchente',
  'ciclone',
  'incendio',
  'seca',
  'deslizamento',
  'terremoto',
  'outro'
);

alter table "public"."eventos"
  add column "tipo" public.evento_tipo_enum not null default 'outro'::public.evento_tipo_enum;

create type "public"."noticia_tag_enum" as enum (
  'alerta',
  'informativo',
  'boas_noticias',
  'transito',
  'previsao_tempo'
);

alter table "public"."noticias"
  add column "tag" public.noticia_tag_enum not null;

create type "public"."prioridade_enum" as enum (
  'alta',
  'media',
  'baixa'
);

alter table "public"."doacao_itens_urgentes"
  add column "prioridade" public.prioridade_enum not null default 'media'::public.prioridade_enum;

create type "public"."user_role_enum" as enum (
  'user',
  'volunteer',
  'admin'
);

alter table "public"."profiles"
  add column "role" public.user_role_enum not null default 'user'::public.user_role_enum;

create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  AS $function$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end; $function$;

create or replace function public.handle_updated_at()
  returns trigger
  language plpgsql
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create or replace function public.set_updated_at()
  returns trigger
  language plpgsql
  AS $function$
begin new.updated_at = now(); return new; end; $function$;

create or replace function public.slugify (
  text
)
  returns text
  language sql
  immutable
  strict
  AS $function$
  select regexp_replace(
    regexp_replace(
      lower(
        translate(
          $1,
          'àáâãäåāăąçćčèéêëēĕęěğìíîïīĭįłñńňòóôõöøōŏőùúûüūŭůűýÿžźżÀÁÂÃÄÅĀĂĄÇĆČÈÉÊËĒĔĘĚĞÌÍÎÏĪĬĮŁÑŃŇÒÓÔÕÖØŌŎŐÙÚÛÜŪŬŮŰÝŸŽŹŻ',
          'aaaaaaaaaccceeeeeeeegiiiiiiilnnnooooooooouuuuuuuuyyzzZAAAAAAAAAACCCEEEEEEEEGIIIIIIILNNNOOOOOOOOOUUUUUUUUYYZZZ'
        )
      ),
      '[^a-z0-9\s-]', '', 'g'   -- remove anything that isn't alphanumeric, space, or hyphen
    ),
    '[\s-]+', '-', 'g'          -- collapse spaces and multiple hyphens into a single hyphen
  );
$function$;

alter table "public"."abrigados"
  add constraint "abrigados_abrigo_id_fkey" foreign key (abrigo_id) references public.abrigos(id) on delete cascade;

alter table "public"."abrigo_itens_urgentes"
  add constraint "abrigo_itens_urgentes_abrigo_id_fkey" foreign key (abrigo_id) references public.abrigos(id) on delete cascade;

alter table "public"."abrigos"
  add constraint "abrigos_evento_id_fkey" foreign key (evento_id) references public.eventos(id) on delete cascade;

alter table "public"."doacao_itens_urgentes"
  add constraint "doacao_itens_urgentes_evento_id_fkey" foreign key (evento_id) references public.eventos(id) on delete cascade;

alter table "public"."locais_doacao"
  add constraint "locais_doacao_evento_id_fkey" foreign key (evento_id) references public.eventos(id) on delete cascade;

alter table "public"."noticias"
  add constraint "noticias_evento_id_fkey" foreign key (evento_id) references public.eventos(id) on delete cascade;

alter table "public"."profiles"
  add constraint "profiles_id_fkey" foreign key (id) references auth.users(id) on delete cascade;

alter table "public"."abrigos"
  add constraint "abrigos_created_by_fkey" foreign key (created_by) references public.profiles(id) on delete set null;

alter table "public"."doacao_itens_urgentes"
  add constraint "doacao_itens_urgentes_created_by_fkey" foreign key (created_by) references public.profiles(id) on delete set null;

alter table "public"."eventos"
  add constraint "eventos_criado_por_fkey" foreign key (criado_por) references public.profiles(id) on delete set null;

alter table "public"."locais_doacao"
  add constraint "locais_doacao_created_by_fkey" foreign key (created_by) references public.profiles(id) on delete set null;

alter table "public"."noticias"
  add constraint "noticias_created_by_fkey" foreign key (created_by) references public.profiles(id) on delete set null;

alter table "public"."vias_interditadas"
  add constraint "vias_interditadas_created_by_fkey" foreign key (created_by) references public.profiles(id) on delete set null;

alter table "public"."vias_interditadas"
  add constraint "vias_interditadas_evento_id_fkey" foreign key (evento_id) references public.eventos(id) on delete cascade;

create view "public"."abrigos_com_contagem" AS  SELECT a.id,
    a.evento_id,
    a.nome,
    a.endereco,
    a.contato,
    a.foto_url,
    a.created_by,
    a.created_at,
    a.updated_at,
    (count(ab.id))::integer AS total_desabrigados
   FROM (public.abrigos a
     LEFT JOIN public.abrigados ab ON ((ab.abrigo_id = a.id)))
  GROUP BY a.id;

create index abrigados_abrigo_id_idx on public.abrigados using btree (abrigo_id);

create index abrigo_itens_urgentes_abrigo_id_idx on public.abrigo_itens_urgentes using btree (abrigo_id);

create index abrigos_evento_id_idx on public.abrigos using btree (evento_id);

create index doacao_itens_urgentes_evento_id_prioridade_idx on public.doacao_itens_urgentes using btree (evento_id, prioridade);

create index eventos_estado_idx on public.eventos using btree (estado);

create index eventos_slug_idx on public.eventos using btree (slug);

create index eventos_status_idx on public.eventos using btree (status);

create index locais_doacao_evento_id_idx on public.locais_doacao using btree (evento_id);

create index noticias_evento_id_publicado_em_idx on public.noticias using btree (evento_id, publicado_em desc);

create index vias_interditadas_evento_id_ativa_idx on public.vias_interditadas using btree (evento_id, ativa);

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create trigger trg_abrigos_updated_at
  before update on public.abrigos
  for each row
  execute function public.set_updated_at();

create trigger trg_doacao_itens_updated_at
  before update on public.doacao_itens_urgentes
  for each row
  execute function public.set_updated_at();

create trigger trg_eventos_updated_at
  before update on public.eventos
  for each row
  execute function public.set_updated_at();

create trigger trg_locais_updated_at
  before update on public.locais_doacao
  for each row
  execute function public.set_updated_at();

create trigger trg_noticias_updated_at
  before update on public.noticias
  for each row
  execute function public.set_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create trigger trg_vias_updated_at
  before update on public.vias_interditadas
  for each row
  execute function public.set_updated_at();

create policy "abrigados: admin gerencia" on "public"."abrigados"
  for all
  to PUBLIC
  using ((exists ( select 1
   from public.profiles
  where ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role_enum)))));

create policy "abrigados: leitura pública" on "public"."abrigados"
  for select
  to PUBLIC
  using (true);

create policy "abrigo_itens_urgentes: admin gerencia" on "public"."abrigo_itens_urgentes"
  for all
  to PUBLIC
  using ((exists ( select 1
   from public.profiles
  where ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role_enum)))));

create policy "abrigo_itens_urgentes: leitura pública" on "public"."abrigo_itens_urgentes"
  for select
  to PUBLIC
  using (true);

create policy "abrigos: admin gerencia" on "public"."abrigos"
  for all
  to PUBLIC
  using ((exists ( select 1
   from public.profiles
  where ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role_enum)))));

create policy "abrigos: leitura pública" on "public"."abrigos"
  for select
  to PUBLIC
  using (true);

create policy "doacao_itens_urgentes: admin gerencia" on "public"."doacao_itens_urgentes"
  for all
  to PUBLIC
  using ((exists ( select 1
   from public.profiles
  where ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role_enum)))));

create policy "doacao_itens_urgentes: leitura pública" on "public"."doacao_itens_urgentes"
  for select
  to PUBLIC
  using (true);

create policy "eventos: admin cria" on "public"."eventos"
  for insert
  to PUBLIC
  with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role_enum)))));

create policy "eventos: admin edita" on "public"."eventos"
  for update
  to PUBLIC
  using ((exists ( select 1
   from public.profiles
  where ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role_enum)))));

create policy "eventos: admin exclui" on "public"."eventos"
  for delete
  to PUBLIC
  using ((exists ( select 1
   from public.profiles
  where ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role_enum)))));

create policy "eventos: leitura pública" on "public"."eventos"
  for select
  to PUBLIC
  using (true);

create policy "locais_doacao: admin gerencia" on "public"."locais_doacao"
  for all
  to PUBLIC
  using ((exists ( select 1
   from public.profiles
  where ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role_enum)))));

create policy "locais_doacao: leitura pública" on "public"."locais_doacao"
  for select
  to PUBLIC
  using (true);

create policy "noticias: admin gerencia" on "public"."noticias"
  for all
  to PUBLIC
  using ((exists ( select 1
   from public.profiles
  where ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role_enum)))));

create policy "noticias: leitura pública" on "public"."noticias"
  for select
  to PUBLIC
  using (true);

create policy "Admin update profiles" on "public"."profiles"
  for update
  to "authenticated"
  using ((role = 'admin'::public.user_role_enum))
  with check ((role = 'admin'::public.user_role_enum));

create policy "Admin write profiles" on "public"."profiles"
  for insert
  to "authenticated"
  with check ((role = 'admin'::public.user_role_enum));

create policy "Allow authenticated users to read data" on "public"."profiles"
  for all
  to "authenticated"
  using (true);

create policy "profiles: usuário edita o próprio" on "public"."profiles"
  for update
  to "authenticated"
  using ((auth.uid() = id));

create policy "vias_interditadas: admin gerencia" on "public"."vias_interditadas"
  for all
  to PUBLIC
  using ((exists ( select 1
   from public.profiles
  where ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role_enum)))));

create policy "vias_interditadas: leitura pública" on "public"."vias_interditadas"
  for select
  to PUBLIC
  using (true);

comment on column "public"."vias_interditadas"."google_maps_place_id" is 'Google Maps Places IDs: https://developers.google.com/maps/documentation/places/web-service/place-id';

comment on extension "hypopg" is 'Hypothetical indexes for PostgreSQL';

comment on extension "index_advisor" is 'Query index advisor';

comment on table "public"."eventos" is 'Cada tragédia ou situação de emergência. Todos os dados são agrupados por evento.';

comment on table "public"."profiles" is 'Perfil público de cada usuário autenticado.';

grant execute on function "public"."handle_new_user"() to "postgres";

grant execute on function "public"."handle_updated_at"() to "postgres";

grant execute on function "public"."set_updated_at"() to "postgres";

grant execute on function "public"."slugify"(text) to "postgres";

revoke all on schema "public" from "postgres";

grant create, usage on schema "public" to "postgres";

grant select on table "public"."abrigados" to "anon";

grant delete, insert, select, update on table "public"."abrigados" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."abrigados" to "postgres";

grant select on table "public"."abrigo_itens_urgentes" to "anon";

grant delete, insert, select, update on table "public"."abrigo_itens_urgentes" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."abrigo_itens_urgentes" to "postgres";

grant select on table "public"."abrigos" to "anon";

grant delete, insert, select, update on table "public"."abrigos" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."abrigos" to "postgres";

grant select on table "public"."doacao_itens_urgentes" to "anon";

grant delete, insert, select, update on table "public"."doacao_itens_urgentes" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."doacao_itens_urgentes" to "postgres";

grant select on table "public"."eventos" to "anon";

grant delete, insert, select, update on table "public"."eventos" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."eventos" to "postgres";

grant select on table "public"."locais_doacao" to "anon";

grant delete, insert, select, update on table "public"."locais_doacao" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."locais_doacao" to "postgres";

grant select on table "public"."noticias" to "anon";

grant delete, insert, select, update on table "public"."noticias" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."noticias" to "postgres";

grant select on table "public"."profiles" to "anon";

grant insert, select, update on table "public"."profiles" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."profiles" to "postgres";

grant delete, insert, select, update on table "public"."profiles" to "service_role";

grant select on table "public"."vias_interditadas" to "anon";

grant delete, insert, select, update on table "public"."vias_interditadas" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."vias_interditadas" to "postgres";

grant usage on type "public"."evento_status_enum" to "postgres";

grant usage on type "public"."evento_tipo_enum" to "postgres";

grant usage on type "public"."noticia_tag_enum" to "postgres";

grant usage on type "public"."prioridade_enum" to "postgres";

grant usage on type "public"."user_role_enum" to "postgres";

grant select on table "public"."abrigos_com_contagem" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."abrigos_com_contagem" to "postgres";

