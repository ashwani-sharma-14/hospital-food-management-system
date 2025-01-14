import React from "react";
import AdminDashBoard from "./AdminDashBoard";
import { jwtVerify, JWTPayload } from "jose";
import { parse } from "cookie";
import { GetServerSideProps } from "next";
import DeliveryDashboard from "./DeliveryDashBoard";
import PantryDashboard from "./PantryDashBoard";
interface UserPayload extends JWTPayload {
  id: string;
  email: string;
  token: string;
  isAdmin: boolean | null;
  isPantry: boolean | null;
  isDelivery: boolean | null;
}

const Dashboard = ({ user }: { user: UserPayload }) => {
  if (!user) {
    return <p>Loading...</p>;
  }

  if (user.isAdmin) {
    return (
      <>
        <AdminDashBoard />
      </>
    );
  } else if (user.isPantry) {
    return (
      <div>
        <PantryDashboard user={user} />
      </div>
    );
  } else if (user.isDelivery) {
    return (
      <div>
        <DeliveryDashboard user={user} />
      </div>
    );
  } else {
    return <p>Access Denied</p>;
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = parse(context.req.headers.cookie || "");
    const token = cookies.access_token;

    if (!token) {
      return {
        redirect: {
          destination: "/sign-in",
          permanent: false,
        },
      };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const { payload } = await jwtVerify(token, secret);

    const userPayload: UserPayload = {
      id: payload.id as string,
      email: payload.email as string,
      token,
      isAdmin: typeof payload.isAdmin === "boolean" ? payload.isAdmin : false,
      isPantry:
        typeof payload.isPantry === "boolean" ? payload.isPantry : false,
      isDelivery:
        typeof payload.isDelivery === "boolean" ? payload.isDelivery : false,
    };

    return {
      props: { user: userPayload },
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }
};

export default Dashboard;
