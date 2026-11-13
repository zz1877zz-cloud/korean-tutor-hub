# 평점 기본값 제안

이 변경은 코드를 고친 것뿐이에요. 기존 튜터 행은 건드리지 않았어요. 데이터베이스에는 적용하지 마세요.

관리자가 튜터를 새로 만들 때 앱은 `rating`을 `null`로 보내요. 리뷰가 생기기 전에는 별점을 비워 둬요.

컬럼에 기본값 `4.5`나 `0`이 남아 있으면, 앱이 `null`을 보내도 데이터베이스가 그 기본값을 넣을 수 있어요. 그때만 아래를 검토해 주세요.

```sql
alter table public.tutors alter column rating drop default;
alter table public.tutors alter column rating drop not null;
```

이미 저장된 평점을 `null`로 바꾸는 문은 넣지 않았어요. 그건 기존 데이터를 바꾸게 됩니다.
