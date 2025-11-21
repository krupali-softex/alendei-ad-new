import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  markNotificationAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../../../services/apiService";

type Notification = {
  id: string;
  text: string;
  read: boolean;
};

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchNotifications = (page: number) => {
    return new Promise<Notification[]>((resolve) => {
      setTimeout(() => {
        const newNotifs = Array.from({ length: 5 }, (_, i) => ({
          id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          text: `Notification ${i + 1 + (page - 1) * 5}`,
          read: false,
        }));
        resolve(newNotifs);
      }, 1000);
    });
  };
  //  const fetchNotifications = async (page: number) => {
  //     try {
  //       setIsLoading(true);
  //       const data = await getNotifications(page);
  //       setNotifications(prev => [...prev, ...data.notifications]);
  //     } catch (error) {
  //       console.error("Failed to fetch notifications:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  const loadMore = async () => {
    const newItems = await fetchNotifications(page);
    setNotifications((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
    if (page >= 3) setHasMore(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  // Mark All as Read
  const handleMarkAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.read);
      await Promise.all(
        unread.map((n) =>
          markNotificationAsRead({ notificationId: String(n.id) })
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Mark all read failed", err);
    }
  };

  // Clear All Notifications
  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
      setHasMore(false);
    } catch (err) {
      console.error("Clear all failed", err);
    }
  };

  // Remove a single notification
  const handleRemove = async (id: string) => {
    try {
      await deleteNotification({ notificationId: String(id) });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  return (
    <li className="nav-item dropdown">
      <Link
        to="#"
        className="nav-link p-0 position-relative"
        id="navbarDropdownNotification"
        role="button"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <img
          src="/assets/images/notification-bell.svg"
          alt="Notification"
          // width="30"
          // height="30"
          className="position-relative"
        />
        {notifications.length > 0 && (
          <span
            className="translate-middle notification-badge"
            style={{ fontSize: "12px" }}
          >
            {/* {notifications.length} */}
          </span>
        )}
      </Link>

      <div
        className="dropdown-menu dropdown-menu-end p-0 dropdown-caret notification-dropdown"
        aria-labelledby="navbarDropdownNotification"
        style={{ width: "320px", maxHeight: "400px", overflow: "auto" }}
        id="scrollableNotification"
      >
        <div className="d-flex justify-content-between align-items-center px-3 py-2 sticky-top bg-white z-1 border-bottom">
          <h6 className="mb-0 text-muted">Notifications</h6>
          <div className="btn-group">
            <button
              onClick={handleMarkAllRead}
              className="btn btn-sm btn-link text-success"
            >
              Read
            </button>
            <button
              onClick={handleClearAll}
              className="btn btn-sm btn-link text-danger"
            >
              Clear
            </button>
          </div>
        </div>

        <InfiniteScroll
          dataLength={notifications.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<p className="text-center py-2 mb-0">Loading...</p>}
          endMessage={
            <p className="text-center py-2 mb-0 text-muted">
              No more notifications
            </p>
          }
          scrollableTarget="scrollableNotification"
        >
          <div className="list-group list-group-flush">
            {notifications.map((notif, id) => (
              <div
                key={notif.id}
                className="list-group-item px-3 py-2 d-flex justify-content-between align-items-start"
              >
                <div>
                  <small>
                    <strong className={notif.read ? "text-muted" : ""}>
                      {notif.text}
                    </strong>
                  </small>
                  <br />
                  <small className="text-muted">{id * 3 + 1} minutes ago</small>
                </div>
                <button
                  onClick={() => handleRemove(notif.id)}
                  className="btn btn-sm btn-link text-danger p-0"
                  title="Remove"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              </div>
            ))}
          </div>
        </InfiniteScroll>

        <div className="dropdown-footer px-3 py-2 bg-light text-center">
          <Link to="/business" className="text-primary">
            View All
          </Link>
        </div>
      </div>
    </li>
  );
};

export default NotificationDropdown;
