import React, { useEffect, useState } from "react";
import { getAdInsights, toggleAdStatus } from "../services/apiService";
import type {
  AdInsightsResponse,
  CampaignInsight,
  PaginationState,
} from "../types/index.d.ts";
import Pagination from "../components/common/ui-common/Pagination";
import PageLimitDropdown from "../components/common/ui-common/PageLimitDropdown";

const Grow: React.FC = () => {
  const [data, setData] = useState<CampaignInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [togglingCampaignId, setTogglingCampaignId] = useState<string | null>(
    null
  );
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 2,
    hasNextPage: true,
    hasPrevPage: true,
  });

  const today = new Date();
  const priorDate = new Date();
  priorDate.setDate(today.getDate() - 30);
  const formatDate = (date: Date) => date.toISOString().split("T")[0]; // YYYY-MM-DD
  const [filters, setFilters] = useState({
    startDate: formatDate(priorDate),
    endDate: formatDate(today),
    limit: 10,
    page: 1,
  });

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response: AdInsightsResponse = await getAdInsights({
        start_date: filters.startDate || "2025-01-01",
        end_date: filters.endDate || "2025-06-30",
        limit: filters.limit,
        page: filters.page,
      });
      setData(response.data || []);
      setPagination((prev) => ({
        ...prev,
        page: filters.page,
        limit: filters.limit,
        total: response.pagination.total || 1,
      }));
    } catch (error) {
      console.error("Failed to fetch ad insights", error);
    } finally {
      setLoading(false);
      setTogglingCampaignId(null);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [filters]);

  const formatNumber = (value: any) => {
    const num = Number(value);
    return isNaN(num) ? "-" : num.toLocaleString("en-IN");
  };

  const handleToggle = async (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
    setTogglingCampaignId(campaignId);
    try {
      const res = await toggleAdStatus(campaignId, { status: newStatus });
      if (res.success) {
        fetchInsights();
      } else {
        console.warn("Failed to update:", res.message);
        setTogglingCampaignId(null);
      }
    } catch (err) {
      console.error("API error while toggling status", err);
      setTogglingCampaignId(null);
    }
  };

  const renderPlatforms = () => (
    <div className="d-flex align-items-center gap-3">
      <img
        src="https://ads.alendei.com/images/fb.svg"
        alt="Facebook"
        width="11"
      />
    </div>
  );

  return (
    <div className="content p-0 my-5">
      <div className="container">
        <div className="table-card">
          <PageLimitDropdown filters={filters} setFilters={setFilters} />

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="text-start"></th>
                  <th className="text-start">#</th>
                  <th className="text-start">Campaign</th>
                  <th className="text-start">Impression</th>
                  <th className="text-start">Ad Views</th>
                  <th className="text-start">Clicks</th>
                  <th className="text-start">Spent</th>
                  <th className="text-start">Platforms</th>
                  <th className="text-start">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center">
                      No campaigns found
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => {
                    const { impressions, clicks, spend, reach } =
                      item.insights || {};
                    return (
                      <tr key={index}>
                        <td className="text-start">
                          <input
                            className="form-check-input small me-0 grow-check"
                            type="checkbox"
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td className="text-start ff-bold">
                          {item.campaignName}
                        </td>
                        <td className="text-start">
                          {formatNumber(impressions)}
                        </td>
                        <td className="text-start">{formatNumber(reach)}</td>
                        <td className="text-start">{formatNumber(clicks)}</td>
                        <td className="text-start">₹{spend ?? "0.00"}</td>
                        <td className="text-start">{renderPlatforms()}</td>
                        <td className="text-start">
                          <div className="d-flex align-items-center gap-2">
                            <a
                              href="#"
                              className="tbl-action"
                              onClick={(e) => {
                                e.preventDefault();
                                handleToggle(item.campaignId, item.status);
                              }}
                            >
                              {togglingCampaignId === item.campaignId ? (
                                <div
                                  className="spinner-border spinner-border-sm text-secondary"
                                  role="status"
                                />
                              ) : (
                                <i
                                  className={`bi ${
                                    item.status === "ACTIVE"
                                      ? "bi-pause-fill text-success"
                                      : "bi-play-fill text-warning"
                                  }`}
                                />
                              )}
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="table-foot d-flex justify-content-between">
            <div className="table-entries d-flex align-items-center selectpicker-sm">
              Showing{" "}
              <span className="text-primary ff-bold ms-1 me-1">
                {data.length}
              </span>{" "}
              Entries
            </div>
            <Pagination
              page={filters.page}
              totalPages={pagination.total}
              onPageChange={(newPage) =>
                setFilters((prev) => ({ ...prev, page: newPage }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grow;
