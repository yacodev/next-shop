export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className='min-h-screen bg-blue-200'>{children}</main>;
}
