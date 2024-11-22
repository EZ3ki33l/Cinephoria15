import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs/server";
import { Unauthorized, Unconnected } from "../_components/unauthorized";
import { SimpleSidebar } from "./_components/simpleSidebar";
import { AdminMenu, AdminMenuMobile } from "./_components/adminMenu";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    return <Unconnected uid={userId as string} role="administrateur" />;
  }

  const isAdmin = await prisma.admin.findUnique({
    where: {
      id: userId as string,
    },
  });
  if (!isAdmin) {
    <Unauthorized uid={userId} role="administrateur" />;
  }

  let admin = await prisma.admin.findUnique({
    where: {
      id: userId,
    },
  });

  if (!admin) {
    return <Unauthorized uid={userId} role="administrateur" />;
  }

  return (
    <div className="flex flex-col mt-10 ">
      <div className="hidden w-full mx-auto max-w-xs min-w-min sm:block">
        <AdminMenu />
      </div>

      <div className="flex-grow ">
        <div className="sm:hidden">
          <SimpleSidebar>
            <AdminMenuMobile />
          </SimpleSidebar>
        </div>
        <div className="my-16 relative">{children}</div>
      </div>
    </div>
  );
}
