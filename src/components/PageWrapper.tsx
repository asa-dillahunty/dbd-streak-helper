import Header from "./Header";

export default function PageWrapper({
  children,
  showBack,
}: {
  children: React.ReactNode;
  showBack?: boolean;
}) {
  return (
    <>
      <Header showBack={showBack} />
      <main className="container mx-auto p-4 flex-col flex justify-center items-center h-1/2">
        {children}
      </main>
    </>
  );
}
