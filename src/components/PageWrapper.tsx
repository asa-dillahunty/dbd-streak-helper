import Header from "./Header";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4 flex-col flex justify-center items-center h-1/2">
        {children}
      </main>
    </>
  );
}
