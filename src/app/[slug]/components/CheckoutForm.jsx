// app/[slug]/components/CheckoutForm.js
"use client";

import { axiosUser } from "@/app/config/useAxiosPublic";
import React, { useState } from "react";
import { FiPlus, FiMinus, FiLoader } from "react-icons/fi";
import { toast } from "sonner";
// Helper function to find the first available payment option
const getFirstAvailablePaymentMethod = (paymentOptions) => {
  if (paymentOptions?.fullPayment) return "fullPayment";
  if (paymentOptions?.cashOnDelivery) return "cashOnDelivery";
  if (paymentOptions?.advanceDeliveryCharge) return "advanceDeliveryCharge";
  return ""; // Fallback if no options are available
};

// FIX: Added brandId and landingPageId to props to send with the order
const CheckoutForm = ({ productInfo, brandId, landingPageId }) => {
  console.log("CheckoutForm productInfo:", productInfo); // Debugging line to check productInfo data
  if (!productInfo) {
    return (
      <section id="checkout-form" className="py-20 bg-slate-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">প্রোডাক্টের তথ্য পাওয়া যায়নি।</p>
        </div>
      </section>
    );
  }

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(() =>
    getFirstAvailablePaymentMethod(productInfo.paymentOptions)
  );
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
  });
  const [orderQuantity, setOrderQuantity] = useState(1);
  // FIX: Added isSubmitting state for loading feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmited] = useState(false);
  const [orderCompletedData, setOrderCompletedData] = useState(null);
  const handleIncreaseQuantity = () => {
    const maxQuantity = productInfo.quantity || 10;
    if (orderQuantity < maxQuantity) {
      setOrderQuantity((prev) => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (orderQuantity > 1) {
      setOrderQuantity((prev) => prev - 1);
    }
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (
      !customerInfo.fullName ||
      !customerInfo.address ||
      !customerInfo.phone
    ) {
      // FIX: Replaced alert with toast notification for consistency
      toast.error("অনুগ্রহ করে আপনার নাম, ঠিকানা এবং ফোন নম্বর পূরণ করুন।");
      return;
    }

    setIsSubmitting(true);

    const orderDetails = {
      product: {
        id: productInfo.id, // Assuming productInfo has an ID
        productName: productInfo.productName,
        unitPrice: productInfo.discountedPrice,
      },
      customer: customerInfo,
      quantity: orderQuantity,
      subtotal: productInfo.discountedPrice * orderQuantity,
      deliveryCharge: productInfo.deliveryCharge,
      total:
        productInfo.discountedPrice * orderQuantity +
        productInfo.deliveryCharge,
      paymentMethod: selectedPaymentMethod,
      // FIX: Added brandId and landingPageId to the payload
      brandId,
      landingPageId,
    };

    try {
      // Use the endpoint for creating payment/invoice
      const response = await axiosUser.post(
        "/landing-page/invoice/create",
        orderDetails
      );

      console.log("Order response:", response.data);

      // FIX: Handle the response to redirect to the payment gateway if a URL is provided
      if (
        response.data.success &&
        response?.data?.paymentData?.payment_url &&
        selectedPaymentMethod != "cashOnDelivery"
      ) {
        // This is an online payment, redirect the user
        window.location.href = response?.data?.paymentData?.payment_url;
        // This is a Cash on Delivery order or another method that doesn't require redirection
        toast.success(
          `ধন্যবাদ, ${customerInfo?.fullName}! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।`
        );
        // Reset the form on success
        setCustomerInfo({ fullName: "", address: "", phone: "", email: "" });
        setOrderQuantity(1);
      } else if (
        response.data.success &&
        selectedPaymentMethod == "cashOnDelivery"
      ) {
        toast.success(
          response.data.message ||
            `Hi ${customerInfo?.fullName}, Thank you for your order! We’ve received it and your Order ID is: ${response?.data?.order?.id}. Please prepare the payment upon delivery.`
        );
        setOrderCompletedData(response?.data?.order);
        setIsSubmited(true);
      } else {
        toast.info(`অর্ডার গ্রহণ হয়নি।`);
      }
    } catch (error) {
      console.error("Failed to submit order:", error);
      toast.error(
        error.response?.data?.message ||
          "দুঃখিত, আপনার অর্ডারটি প্রক্রিয়া করা যায়নি।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = productInfo.discountedPrice * orderQuantity;
  const total = subtotal + productInfo.deliveryCharge;
  const discountPercentage =
    productInfo.originalPrice > 0
      ? Math.round(
          ((productInfo.originalPrice - productInfo.discountedPrice) /
            productInfo.originalPrice) *
            100
        )
      : 0;

  if (isSubmitted) {
    return (
      <section className="py-20 bg-green-50 text-center">
        <div className="container mx-auto px-4 max-w-xl bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 text-green-600 p-4 rounded-full">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-green-700 mb-4">
            অর্ডার সম্পন্ন হয়েছে!
          </h2>
          <p className="text-gray-700 mb-2">
            ধন্যবাদ,{" "}
            <span className="font-semibold text-green-700">
              {customerInfo.fullName || ""}
            </span>
            !
          </p>
          <p className="text-gray-600 mb-1">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
          </p>

          <div className="flex flex-col justify-center items-center gap-2">
            <div className="bg-green-100 text-green-800 rounded-lg px-4 py-3 mb-4 inline-block">
              <p className="font-semibold">
                অর্ডার আইডি:{" "}
                <span className="font-mono">
                  {orderCompletedData?.id || "—"}
                </span>
              </p>
              <p>
                নাম:{" "}
                <span className="font-medium">{customerInfo.fullName}</span>
              </p>
              <p>
                ঠিকানা:{" "}
                <span className="font-medium whitespace-pre-line">
                  {customerInfo.address}
                </span>
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300"
            >
              আবার অর্ডার করব
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="checkout-form" className="py-20 bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-800">
              আপনার অর্ডার করুন
            </h2>
            <p className="text-slate-600 mt-2">
              আপনার ক্রয় সম্পূর্ণ করতে নিচের ফর্মটি পূরণ করুন
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6 mb-6">
              <img
                // FIX: Added a fallback placeholder for the product image
                src={
                  productInfo.productImage ||
                  "https://placehold.co/100x100/E2E8F0/475569?text=Image"
                }
                alt={productInfo.productName}
                className="w-24 h-24 rounded-lg object-cover border-2 border-slate-100 flex-shrink-0"
              />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-bold text-xl text-slate-800">
                  {productInfo.productName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {productInfo.productDescription}
                </p>
                <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-2">
                  <span className="text-2xl font-bold text-green-600">
                    ৳{productInfo.discountedPrice}
                  </span>
                  {productInfo.originalPrice > productInfo.discountedPrice && (
                    <span className="text-lg font-medium text-red-400 line-through">
                      ৳{productInfo.originalPrice}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      {discountPercentage}% ছাড়
                    </span>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-6">
              {/* Customer Info Inputs */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-md font-semibold text-gray-700 mb-1"
                >
                  পূর্ণনাম
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={customerInfo.fullName}
                  onChange={handleCustomerInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
                  required
                  placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-md font-semibold text-gray-700 mb-1"
                >
                  ডেলিভারি ঠিকানা
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
                  required
                  placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-md font-semibold text-gray-700 mb-1"
                >
                  ফোন নম্বর
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
                  required
                  placeholder="আপনার ১১ সংখ্যার ফোন নম্বর"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    পরিমাণ
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      type="button"
                      onClick={handleDecreaseQuantity}
                      className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 transition"
                      disabled={orderQuantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="w-full text-center text-lg font-semibold">
                      {orderQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncreaseQuantity}
                      className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50 transition"
                      disabled={orderQuantity >= (productInfo.quantity || 10)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-md font-semibold text-gray-700 mb-1"
                  >
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="আপনার ইমেইল ঠিকানা"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="border-t pt-6">
                <label className="block text-md font-semibold text-gray-700 mb-3">
                  পেমেন্ট পদ্ধতি নির্বাচন করুন
                </label>
                <div className="space-y-3">
                  {/* Payment option rendering logic remains the same */}
                  {productInfo.paymentOptions?.fullPayment && (
                    <label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPaymentMethod === "fullPayment"
                          ? "border-purple-500 ring-2 ring-purple-200 bg-purple-50"
                          : "border-gray-300 bg-gray-50 hover:border-purple-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="fullPayment"
                        checked={selectedPaymentMethod === "fullPayment"}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-3 font-medium">
                        সম্পূর্ণ পেমেন্ট (Online Payment)
                      </span>
                    </label>
                  )}
                  {productInfo.paymentOptions?.cashOnDelivery && (
                    <label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPaymentMethod === "cashOnDelivery"
                          ? "border-purple-500 ring-2 ring-purple-200 bg-purple-50"
                          : "border-gray-300 bg-gray-50 hover:border-purple-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cashOnDelivery"
                        checked={selectedPaymentMethod === "cashOnDelivery"}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-3 font-medium">
                        ক্যাশ অন ডেলিভারি (Cash on Delivery)
                      </span>
                    </label>
                  )}
                  {productInfo.paymentOptions?.advanceDeliveryCharge && (
                    <label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPaymentMethod === "advanceDeliveryCharge"
                          ? "border-purple-500 ring-2 ring-purple-200 bg-purple-50"
                          : "border-gray-300 bg-gray-50 hover:border-purple-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="advanceDeliveryCharge"
                        checked={
                          selectedPaymentMethod === "advanceDeliveryCharge"
                        }
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-3 font-medium">
                        শুধু ডেলিভারি চার্জ অগ্রিম
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">
                    পণ্যের মূল্য ({orderQuantity} টি)
                  </span>
                  <span className="font-semibold">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">ডেলিভারি চার্জ</span>
                  <span className="font-semibold">
                    ৳{productInfo.deliveryCharge}
                  </span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-slate-800 border-t pt-3 mt-3">
                  <span>মোট:</span>
                  <span>৳{total}</span>
                </div>
              </div>

              {/* FIX: Submit button now shows loading state */}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white text-xl font-bold py-4 rounded-xl shadow-lg hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center justify-center disabled:bg-purple-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin mr-3" />
                    অর্ডার করা হচ্ছে...
                  </>
                ) : (
                  "অর্ডার নিশ্চিত করুন"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutForm;
