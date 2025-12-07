# 📁 SQL Scripts - Feedback System

## 🚨 Start Here!

**Jika Anda mendapat error 404 saat akses `/admin/feedback`:**

→ **Jalankan script ini:** `create-feedback-table.sql`

---

## 📜 Available Scripts

### 1. **create-feedback-table.sql** ⭐ WAJIB

**When to use:** Tabel feedback belum ada (error 404)

**What it does:**

- ✅ Membuat tabel `feedback` lengkap
- ✅ Setup RLS (Row Level Security) policies
- ✅ Membuat indexes untuk performa
- ✅ Setup trigger untuk `updated_at`
- ✅ Insert sample data untuk testing

**How to run:**

```
1. Supabase Dashboard → SQL Editor
2. Copy paste isi file ini
3. Run
4. ✅ Selesai!
```

---

### 2. **add-feedback-type-column.sql**

**When to use:** Tabel feedback sudah ada, tapi kolom `type` belum ada

**What it does:**

- ✅ Menambahkan kolom `type` ke tabel existing
- ✅ Menambahkan constraint untuk valid types
- ✅ Membuat index pada kolom `type`

**Note:** Jika Anda sudah menjalankan `create-feedback-table.sql`, **TIDAK PERLU** menjalankan script ini lagi.

---

## 🔍 Which Script Should I Run?

```
┌─────────────────────────────────────┐
│ Cek di Browser Console:             │
│ Error 404 pada /admin/feedback?     │
└──────────┬──────────────────────────┘
           │
     ┌─────┴─────┐
     │           │
    YES         NO
     │           │
     ▼           ▼
  Run #1      Run #2
  create-    add-type-
  feedback-  column.sql
  table.sql
```

---

## 📊 Verification

After running the scripts, verify in Supabase:

### Check Table Exists:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'feedback';
```

### Check Columns:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'feedback'
ORDER BY ordinal_position;
```

**Expected columns:**

- ✅ id (uuid)
- ✅ user_id (uuid)
- ✅ name (text)
- ✅ email (text)
- ✅ subject (text)
- ✅ message (text)
- ✅ type (text)
- ✅ status (text)
- ✅ created_at (timestamp)
- ✅ updated_at (timestamp)

### Check RLS Policies:

```sql
SELECT * FROM pg_policies WHERE tablename = 'feedback';
```

**Expected policies:**

- ✅ Anyone can insert feedback
- ✅ Users can view own feedback
- ✅ Admins can update feedback
- ✅ Admins can delete feedback

### Test Insert:

```sql
INSERT INTO feedback (name, email, subject, message, type)
VALUES ('Test', 'test@example.com', 'Test Subject', 'Test Message', 'other');

SELECT * FROM feedback ORDER BY created_at DESC LIMIT 1;
```

---

## 🐛 Troubleshooting

### Error: "relation 'feedback' does not exist"

→ Run `create-feedback-table.sql`

### Error: "column 'type' does not exist"

→ Run `add-feedback-type-column.sql`

### Error: "new row violates check constraint"

→ Type value harus salah satu: `bug`, `feature`, `improvement`, `complaint`, `other`

### No errors but data tidak muncul

→ Cek RLS policies dengan query di atas

---

## 🎯 Quick Reference

| File                             | Purpose           | When to Run           | Required |
| -------------------------------- | ----------------- | --------------------- | -------- |
| **create-feedback-table.sql**    | Buat tabel baru   | Tabel belum ada       | ⭐ YES   |
| **add-feedback-type-column.sql** | Tambah kolom type | Tabel ada, type tidak | Optional |

---

## 📚 Related Documentation

- **FIX_FEEDBACK_404.md** - Detailed guide untuk fix error 404
- **FEEDBACK_SETUP_GUIDE.md** - Complete setup guide
- **FEEDBACK_SYSTEM.md** - System architecture & documentation

---

**Last Updated**: 23 November 2025  
**Scripts Version**: 1.0  
**Status**: ✅ Production Ready
