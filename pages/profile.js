import {getSession} from "next-auth/client";

import UserProfile from '../components/profile/user-profile';

function ProfilePage() {
  return <UserProfile />;
}

export async function getServerSideProps(contex) {
  const session = await getSession({req: contex.req});

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    };
  }

  return {
    props: { session },
  };
}

export default ProfilePage;
