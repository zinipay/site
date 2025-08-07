"use client"; // Ensures this component runs on the client, enabling hooks

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
  FaArrowLeft,
  FaCog,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { axiosUser } from "@/app/config/useAxiosPublic";

// --- API Call Function ---
const verifyPaymentOnServer = (orderId, invoiceId) => {
  // This function calls your backend API.
  // The endpoint should be the full URL to your backend if it's on a different domain.
  // For same-domain deployments, a relative path is fine.
  const apiUrl = `/landing-page/verify-payment`;

  console.log(
    `Verifying payment with API... OrderID: ${orderId}, InvoiceID: ${invoiceId}`
  );

  return axiosUser.post(apiUrl, {
    orderId,
    invoiceId,
  });
};

// --- Sub-components for UI structure ---

const StatusIcon = ({ status }) => {
  const iconMap = {
    COMPLETED: <FaCheckCircle className="w-16 h-16 text-green-500" />,
    PROCESSING: (
      <FaCog
        className="w-16 h-16 text-blue-500 animate-spin"
        style={{ animationDuration: "3s" }}
      />
    ),
    FAILED: <FaTimesCircle className="w-16 h-16 text-red-500" />,
    PENDING: <FaClock className="w-16 h-16 text-yellow-500" />,
  };
  return (
    iconMap[status] || (
      <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
    )
  );
};

const DetailRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-200 last:border-b-0">
      <span className="text-sm text-gray-500 mb-1 sm:mb-0">{label}</span>
      <span className="font-medium text-gray-800 text-left sm:text-right">
        {value}
      </span>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-4 p-6">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
    ))}
  </div>
);

// --- Main Page Component ---

const VerifyPage = () => {
  const [transaction, setTransaction] = useState(null);
  const [message, setMessage] = useState("");
  const [contactInfo, setContactInfo] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const orderId = pathname.split("/").pop();
  const invoiceId = searchParams.get("invoiceId");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (orderId && invoiceId) {
      verifyPaymentOnServer(orderId, invoiceId)
        .then((response) => {
          const { data, contactUs, checkoutUrl, message } = response.data;
          setTransaction(data);
          setContactInfo(contactUs);
          setCheckoutUrl(checkoutUrl);
          setMessage(message);
        })
        .catch((err) => {
          console.error("API Error:", err.response?.data || err.message);
          const apiError = err.response?.data;
          setError(apiError?.message || "An unexpected error occurred.");
          if (apiError?.contactUs) {
            setContactInfo(apiError.contactUs);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError(
        "Missing required information in the URL to verify the transaction."
      );
      setLoading(false);
    }
  }, [orderId, invoiceId]);

  // Redirect to checkout URL after loading and if no error

  useEffect(() => {
    if (checkoutUrl && !loading && !error) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timer = setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [checkoutUrl, loading, error]);

  const handlePrint = () => window.print();

  const statusConfig = {
    COMPLETED: {
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      textColor: "text-green-700",
    },
    PROCESSING: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
    },
    FAILED: {
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-700",
    },
    PENDING: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-700",
    },
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-700",
    },
    loading: {
      bgColor: "bg-gray-50",
      borderColor: "border-gray-300",
      textColor: "text-gray-800",
    },
  };

  const currentState = loading
    ? "loading"
    : error
    ? "error"
    : transaction?.status;
  const currentConfig = statusConfig[currentState];

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        <header className="mb-6 text-center">
          {/* <h1 className="text-4xl font-bold text-gray-800">ZiniPay</h1> */}
          <p className="text-gray-500 mt-1">Transaction Verification</p>
        </header>

        <main className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300">
          <div
            className={`p-6 border-l-8 ${currentConfig.borderColor} ${currentConfig.bgColor}`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <StatusIcon status={currentState} />
              </div>
              <div className="flex-grow">
                <h4
                  className={`text-xl md:text-2xl font-bold ${currentConfig.textColor}`}
                >
                  {loading ? "Verifying Payment..." : error || message}
                </h4>
                {!error && !loading && (
                  <p className="text-gray-600">Order ID: #{transaction?.id}</p>
                )}
              </div>
            </div>
          </div>
         
          {checkoutUrl && !loading && !error && (
            <div className="mt-4 text-center">
              <p className="inline-flex items-center gap-2 text-sm text-indigo-600 bg-indigo-100 px-4 py-2 rounded-md shadow-sm border border-indigo-200">
                <FaClock className="animate-pulse text-indigo-500" />
                Redirecting in{" "}
                <span className="font-semibold">{countdown}</span> second
                {countdown !== 1 && "s"}...
              </p>
            </div>
          )}

          <div className="bg-white">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              transaction && (
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-700 border-b pb-2">
                    Order Details
                  </h3>
                  <div className="space-y-2">
                    <DetailRow
                      label="Product"
                      value={transaction.productName}
                    />
                    <DetailRow
                      label="Customer Name"
                      value={transaction.fullName}
                    />
                    <DetailRow
                      label="Subtotal"
                      value={`৳${transaction.subtotal?.toFixed(2)}`}
                    />
                    <DetailRow
                      label="Delivery Charge"
                      value={`৳${transaction.deliveryCharge?.toFixed(2)}`}
                    />
                    <DetailRow
                      label="Total Amount"
                      value={`৳${transaction.total?.toFixed(2)}`}
                    />
                    <DetailRow
                      label="Amount Paid"
                      value={
                        transaction.completedAmount
                          ? `৳${transaction.completedAmount.toFixed(2)}`
                          : "N/A"
                      }
                    />
                    <DetailRow
                      label="Shipping Address"
                      value={transaction.address}
                    />
                  </div>
                </div>
              )
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
            {checkoutUrl && (
              <a
                href={checkoutUrl}
                target="_blank"
                className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                Access Your Product
              </a>
            )}
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={handlePrint}
              disabled={loading || transaction?.status === "FAILED"}
              className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <FaFileAlt className="w-4 h-4 mr-2" />
              Print Receipt
            </button>
          </div>
        </main>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          {contactInfo ? (
            <p>
              Questions? Contact{" "}
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-indigo-600 hover:underline"
              >
                {contactInfo.email}
              </a>{" "}
              or call{" "}
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-indigo-600 hover:underline"
              >
                {contactInfo.phone}
              </a>
            </p>
          ) : (
            <p>
              Questions? Contact support at{" "}
              <a
                href="mailto:support@zinipay.com"
                className="text-indigo-600 hover:underline"
              >
                support@zinipay.com
              </a>
            </p>
          )}
          <p>
            &copy; {new Date().getFullYear()} ZiniPay Bangladesh. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default VerifyPage;
