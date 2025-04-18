import React, { useEffect, useState } from "react";
import { Button } from "src/views/components";
import { DonationSelector } from "./DonationSelector";
import { CampaignPriceType, CampaignProductType, Currency, ProjectId } from "src/api/model";
import { CheckoutBody, CheckoutParams, CheckoutQuery, Price } from "src/api/dto";
import { PaymentHeader } from "./PaymentHeader";
import { displayedCurrencies } from "src/views/data";
import { ApiError } from "../../../../../../ultils/error/ApiError";
import { getBackendAPI } from "../../../../../../services";
import { config, Env } from "../../../../../../ultils";
import { NumberUtils } from "../../../../../../ultils/NumberUtils";

interface PaymentControlsProps {
  projectId: ProjectId;
  preferredCurrency: Currency;
  prices: Record<CampaignPriceType, Record<Currency, Record<CampaignProductType, Price[]>>>;
  paymentSuccessUrl: string;
  paymentCancelUrl: string;
}

export function PaymentControls(props: PaymentControlsProps) {
  const backendAPI = getBackendAPI();
  const displayedCurrency = displayedCurrencies[props.preferredCurrency];

  const [priceType, setPriceType] = useState<CampaignPriceType>(CampaignPriceType.MONTHLY);
  const [campaignProductType, setCampaignProductType] = useState<CampaignProductType>(CampaignProductType.DONATION);

  const [selectedPriceIndex, setSelectedPriceIndex] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(value);
    if (value) {
      // setSelectedAmount(parseInt(value, 10));
    }
  };

  const handleCheckout = async () => {
    if (!selectedPrice) {
      return;
    } else {
      setIsLoading(true);
      try {
        const params: CheckoutParams = {};
        const body: CheckoutBody = {
          mode: priceType === CampaignPriceType.MONTHLY ? "subscription" : "payment",
          priceItems: [
            {
              priceId: selectedPrice.price.stripeId,
              quantity: selectedPrice.quantity,
            },
          ],
          countryCode: null, // TODO: Add country code base on user's location
          successUrl: props.paymentSuccessUrl,
          cancelUrl: props.paymentCancelUrl,
        };
        const query: CheckoutQuery = {};

        const response = await backendAPI.checkout(params, body, query);
        if (response instanceof ApiError) {
          setError(response);
        } else {
          window.location.href = response.redirectUrl;
        }
      } catch (error) {
        console.error("Failed to initiate checkout:", error);
        setError(ApiError.from(error));
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (props.prices && selectedPriceIndex !== null) {
      setSelectedPrice(props.prices && props.prices[priceType][props.preferredCurrency][campaignProductType][selectedPriceIndex]);
    } else {
      setSelectedPrice(null);
    }
  }, [props.prices, priceType, props.preferredCurrency, campaignProductType, selectedPriceIndex]);

  return (
    <>
      {/*TODO*/}
      {error && <div className="text-red-500">{error.message}</div>}
      <div className="my-6 2xl:my-7 3xl:my-10">
        <PaymentHeader priceType={priceType} setPriceType={setPriceType} />
      </div>

      <div className="grid grid-cols-2 !gap-4 3xl:!gap-5">
        {props.prices &&
          props.prices[priceType][props.preferredCurrency][campaignProductType].map((price: Price, index) => (
            <button
              key={index}
              onClick={() => setSelectedPriceIndex(index)}
              className={`${
                selectedPriceIndex === index ? "bg-gradient-custom pointer-events-none" : ""
              } text-white !px-3 flex bg-[#16263B] justify-center min-h-16 sm:duration-100 sm:ease-linear sm:transition-all flex-col sm:h-[69px] 3xl:h-[81px] items-center 3xl:!px-4 rounded-[13px]`}
              aria-pressed={selectedPriceIndex === index}
            >
              <h5 className="text-base sm:text-lg 3xl:text-xl !leading-[110%] !mb-1 font-bold">
                {NumberUtils.toLocaleStringPrice(price.totalAmount, props.preferredCurrency)}
                <span className="font-normal ">{priceType === CampaignPriceType.MONTHLY ? "/mo" : ""}</span>
              </h5>
              <h6 className="text-xs sm:text-sm 3xl:text-base !leading-[125%]">{price.label}</h6>
            </button>
          ))}

        {config.env !== Env.Production && (
          <button
            className={`${
              customAmount ? "border-[#D8D8D8] border" : ""
            } w-full min-h-16 sm:h-[69px] 3xl:h-[81px]  bg-[#16263B] border-[#D8D8D8]  border rounded-xl flex items-center px-6`}
          >
            <span className="text-white text-base sm:text-lg 3xl:text-xl font-medium">{displayedCurrency.symbol}</span>
            <input
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder={`Other${priceType === CampaignPriceType.MONTHLY ? "/mo" : ""}`}
              className="bg-transparent text-white text-base sm:text-lg 3xl:text-xl placeholder:text-sm sm:placeholder:text-lg w-full focus:outline-none ml-2 placeholder-gray-400"
              aria-label="Custom donation amount"
            />
          </button>
        )}
      </div>

      <DonationSelector projectId={props.projectId} productType={campaignProductType} setProductType={setCampaignProductType} />

      <Button
        disabled={selectedPrice === null || isLoading}
        audience="USER"
        level="PRIMARY"
        size="LARGE"
        className="w-full !font-bold !font-montserrat lg:!text-xl 3xl:!text-2xl 3xl:!h-[70px] !capitalize overflow-hidden cursor-pointer mt-4"
        onClick={handleCheckout}
      >
        {(() => {
          const formattedPrice = selectedPrice
            ? `${NumberUtils.toLocaleStringPrice(selectedPrice.totalAmount, props.preferredCurrency)}${priceType === CampaignPriceType.MONTHLY ? "/mo" : ""}`
            : "";

          return selectedPrice
            ? campaignProductType === CampaignProductType.DONATION
              ? `Donate ${formattedPrice}`
              : `Receive ${formattedPrice} of DoWs`
            : "Select an amount to donate";
        })()}
      </Button>
    </>
  );
}
