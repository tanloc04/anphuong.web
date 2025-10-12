import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChartLine} from "@fortawesome/free-solid-svg-icons";
import { minutes } from "../utils/toMilliseconds";
import { fetchCustomers } from "@/api/analize";


const UserOverview = () => {
  //const [users, setUsers] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const result = await fetchCustomers(
          {
            keyword: "", status: "", isDelete: "false"
          },
          {
            pageNum: 1,
            pageSize: 0,     
          }
        );

        const customerList = result?.data?.pageData || [];

        const now = new Date();
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(now.getDate() - 5);

        const recent = customerList.filter((user: any) => {
          if (!user.createdAt)
            return false;
          const created = new Date(user.createdAt);
          return created >= fiveDaysAgo && created <= now;
        });

        //setUsers(customerList);
        setRecentUsers(recent);
        setTotalUsers(customerList.length);

      } catch (err) {
        console.log('Failed to fecth users with error: ', err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
    const intervalId = setInterval(getUsers, minutes(30));
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-6 border rounded-xl dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FontAwesomeIcon 
            icon={faUser} 
            className="text-violet-500 text-lg"
          />
          User Overview
        </h2>
        <span className="text-sm text-zinc-500">
          {loading ? "Loading..." : "Updated just now"}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-violet-100 dark:bg-violet-800/30 rounded-full">
          <FontAwesomeIcon 
            icon={faUser} 
            className="text-violet-500 text-xl"
          />
        </div>
        <div>
          <p className="text-sm text-zinc-500">Total Users</p>
          <p className="text-2xl font-bold">
            {loading ? "..." : totalUsers.toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <FontAwesomeIcon 
            icon={faChartLine}
            className="text-green-600 text-2xl"
          />
          Recently Active (Last 5 days)
        </h3>

        {loading ? (<p className="text-zinc-500 text-sm">Loading users...</p>) : recentUsers.length === 0 ? (<p className="text-zinc-500 text-sm">No users created in last 5 days</p>) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {recentUsers.slice(0, 5).map((user) => (
              <li 
                key={user.id}
                className="py-2 flex justify-between text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-md px-2 transition"
              >
                <span>{user.fullname || "Unknown user"}</span>
                <span className="text-zinc-500">{new Date(user.createdAt).toLocaleDateString()}</span>
              </li>))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserOverview;
