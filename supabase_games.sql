create table if not exists games (
 id text primary key,
 title text, subtitle text, genre text, engine text,
 startDate text, endDate text, status text, description text,
 analysis text, optimization text, implementation text,
 implImages jsonb, screenshots jsonb, videoUrl text,
 tags jsonb, teamSize int, role text, platforms jsonb, highlights jsonb,
 created_at timestamp default now()
);

alter table games enable row level security;
create policy "public read games" on games for select using (true);
create policy "public write games" on games for insert with check (true);
create policy "public update games" on games for update using (true);
create policy "public delete games" on games for delete using (true);
