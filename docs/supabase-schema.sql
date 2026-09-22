-- Supabase SQL Editor에 붙여넣고 실행하세요.

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  guarantee_number text unique not null,
  name text not null,
  phone text not null,
  business text,
  type text not null,
  amount bigint not null,
  period text not null,
  status text not null default '접수 완료',
  certificate_data text,
  premium_amount bigint,
  payment_account text,
  created_at timestamptz not null default now()
);

create index if not exists applications_name_phone_idx on applications (name, phone);

-- RLS를 켜두고 별도의 public 정책은 만들지 않습니다.
-- 이 앱은 서버(Route Handler)에서 서비스 롤 키로만 접근하므로,
-- 브라우저에서 이 테이블에 직접 접근할 방법이 없습니다.
alter table applications enable row level security;

-- 이미 테이블을 만드셨다면 위 create table은 무시되고, 아래 한 줄만 실행하면
-- 기존 테이블에 보증서 이미지 컬럼이 추가됩니다.
alter table applications add column if not exists certificate_data text;

-- 보험료 납입 안내(보험료, 입금 계좌)를 위한 컬럼입니다. 기존 테이블에는 이 두 줄을 실행하세요.
alter table applications add column if not exists premium_amount bigint;
alter table applications add column if not exists payment_account text;
