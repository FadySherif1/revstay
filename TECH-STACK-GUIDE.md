# دليل تقنيات مشروع Revstay

مشروع Revstay هو مشروع Full-Stack، أي أن الـFrontend والـBackend موجودان
داخل نفس المشروع باستخدام Next.js وTypeScript.

## لغات البرمجة

- **TypeScript:** اللغة الأساسية في الـFrontend والـBackend.
- **TSX:** TypeScript مع إمكانية كتابة واجهات React.
- **CSS:** لتنسيق الموقع والـresponsive design والثيمات.
- **SQL:** تُستخدم في migrations، بينما يتم التعامل مع قاعدة البيانات غالبًا
  من خلال Prisma.

## Frontend

- **React:** بناء الـcomponents والواجهات التفاعلية.
- **Next.js:** إنشاء الصفحات والـlayouts والتنقل.
- **Tailwind CSS:** تصميم وتنسيق الواجهة.
- **GSAP وFramer Motion:** الأنيميشن وحركات الـscroll.
- **Lenis:** الـsmooth scrolling.
- **Embla Carousel:** الـsliders والـcarousels.
- **Lucide React:** الأيقونات.
- **next-intl:** دعم العربية والإنجليزية وRTL.

## Backend

- **Next.js Server Actions:** تنفيذ التسجيل والحجز وعمليات الـadmin.
- **Next.js API Routes:** إنشاء API للـauthentication والـchatbot وتتبع الزيارات.
- **Auth.js:** تسجيل الدخول باستخدام Google أو الإيميل وكلمة المرور.
- **Zod:** التحقق من صحة البيانات.
- **bcryptjs:** تشفير كلمات المرور.
- **Prisma ORM:** التعامل مع قاعدة البيانات.
- **PostgreSQL على Neon:** تخزين المستخدمين والحجوزات والبيانات.
- **Upstash Redis:** الـrate limiting والحماية من الطلبات الزائدة.
- **Resend:** إرسال الإيميلات.
- **OpenAI SDK:** تشغيل Chatbot الموقع.

## الفرق بين `.ts` و`.tsx`

### ملفات `.ts`

هي ملفات TypeScript عادية لا تحتوي على JSX أو عناصر واجهة.

تُستخدم في:

- منطق الـBackend.
- Server Actions.
- الاتصال بقاعدة البيانات.
- التحقق من البيانات.
- الدوال والأدوات المساعدة.

مثال:

```ts
export function calculateTotal(price: number, rooms: number) {
  return price * rooms;
}
```

أمثلة من المشروع:

- `src/actions/booking.ts`
- `src/lib/prisma.ts`
- `src/lib/booking-schema.ts`

### ملفات `.tsx`

هي ملفات TypeScript تسمح بكتابة JSX، أي عناصر واجهة تشبه HTML.

تُستخدم في:

- React Components.
- صفحات Next.js.
- الـlayouts.
- الـmodals والأزرار وأجزاء الصفحة.

مثال:

```tsx
type ButtonProps = {
  title: string;
};

export function Button({ title }: ButtonProps) {
  return <button>{title}</button>;
}
```

أمثلة من المشروع:

- `src/app/[locale]/page.tsx`
- `src/components/sections/navbar.tsx`
- `src/components/auth/booking-modal.tsx`

## الخلاصة

```text
.ts  = TypeScript بدون JSX
.tsx = TypeScript + JSX لواجهات React
```

إذا كان الملف يحتوي على عناصر مثل `<div>` أو `<button>` فيجب أن يكون
امتداده `.tsx`. أما إذا كان يحتوي فقط على functions وobjects ومنطق برمجي
فعادةً يكون امتداده `.ts`.

## مسار البيانات في المشروع

```text
React + Next.js + Tailwind + GSAP
                 ↓
Next.js Server Actions + API Routes
                 ↓
Zod + Auth.js + bcryptjs
                 ↓
Prisma ORM
                 ↓
PostgreSQL on Neon
```
