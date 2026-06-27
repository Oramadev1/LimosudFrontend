import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Cancellation Policy & Terms of Rental",
  description:
    "Free cancellation policy, rental terms, and cross-border rules for Limosud Cars car rentals in Dakhla.",
  path: routes.terms,
});

const rentalTerms = [
  "In order to rent a car from any category, the client should be at least 23 years old.",
  "The driver must hold a valid driving license issued at least one year before the rental commencement.",
  "Minimum car rental period is TWO days (48 hours). After the passage of 48 hours, and depending on the season the rental takes place, an extra day is charged.",
  "In case of early return of the car, earlier than the date and time stated on the rental agreement signed by the client, no refund is given. The client is obliged to compensate the company for the whole period initially agreed.",
  "Gasoline: The customer must return the gasoline tank at the same level as taken. Money for extra gasoline is not returned. The customer is charged for less tank level according to the car category and the current fuel prices.",
  "Reservation is made for a specific car category but NOT for a specific car model.",
  "Unlimited mileage within the geographical area of the Dakhla-Oued Ed-Dahab region and insurance with Collision Damage Waiver (CDW) is included in the price and reduces the driver's liability in case of damages caused to the car's bodywork. This is called \"Excess\" and depends on the category of the car as stated in the reservation. Depending on the client's choice, the liability can be further reduced or even zeroed by paying the corresponding additional fee. No insurance coverage applies if the driver is under the influence of alcohol, drugs or other substances or in the event of an accident following a violation of Moroccan law.",
  "No insurance covers any damage off-road, or any damage caused underneath the car, or to the tires. In any case, all damages to the tires of the car due to misuse or accident are the renter's responsibility.",
  "In the event of an accident the renter must immediately inform the police and the company, giving full explanations of the incident.",
  "Upon car delivery the renter, by signing the rental agreement, confirms the good condition of the car. In addition it is the renter's responsibility to examine the car and ensure that the company's employee will mark any damages on the rental agreement. It is equally the renter's obligation to return the car to the company along with all official documents, tools and accompanying accessories in the exact same condition in which they were delivered to him, and in the time and location specified in the rental contract. In an opposite case and after the lapse of the agreed date and time of the car collection, the renter is under the obligation to pay to the lessor company the amount corresponding to compensation.",
  "The lessor company reserves the right to recapture possession and use of the rental car at any time with no previous warning and without the renter's consent, but at his expenses, from whatever location and by whatever means, in case in the company's judgement there is potential risk of damage or loss of the car, as well as a risk of not collecting compensation for use and every other compensation owed to the lessor company.",
  "It is the renter's obligation to look after the car, to maintain the car in good condition, to check its mechanical condition, oil level and water level, the tires of the car, etc., and, in general, to ensure the safe drive of the car. No repairs of the car may be realized by either the renter or third parties without the lessor company's prior authorization.",
  "The renter will bear exclusively and in full the expenses of traffic fines or any other administrative contravention.",
  "It is prohibited to sublease the car to third parties or to use the car for transporting people or property for hire, for taking in tow or hauling cars or other material, for participating, running or following any kind of racing activities, for transporting illegal materials or in any purpose that is against the laws of the Kingdom of Morocco.",
  "No third person may use or drive the car besides the renter and any additional driver as specified in the company's rental agreement.",
];

export default function TermsPage() {
  const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <div className="mb-10">
        <p className="text-sm font-medium text-[#E8192C]">{siteConfig.brand}</p>
        <h1 className="mt-2 text-3xl font-bold text-[#1A1A1A]">
          Cancellation Policy &amp; Terms of Rental
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#666]">
          Please read these conditions carefully before booking with {siteConfig.name}. By completing a
          reservation you agree to the terms below.
        </p>
      </div>

      <section className="mb-10 rounded-[10px] border border-[#E5E5E5] bg-white p-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Cancellation Policy</h2>
        <h3 className="mt-4 text-base font-semibold text-[#1A1A1A]">Free Cancellation</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#555]">
          We would appreciate it if, in case you need to cancel your reservation, you could contact us
          through telephone or WhatsApp at{" "}
          <a href={phoneHref} className="font-medium text-[#3563E9] hover:underline">
            {siteConfig.phone}
          </a>{" "}
          or by email at{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="font-medium text-[#3563E9] hover:underline"
          >
            {siteConfig.contactEmail}
          </a>
          , stating your reservation number and your details.
        </p>
        <p className="mt-3 text-sm text-[#666]">
          Address: {siteConfig.address}
        </p>
      </section>

      <section className="mb-10 rounded-[10px] border border-[#E5E5E5] bg-white p-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Terms of Rental</h2>
        <ol className="mt-5 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-[#555]">
          {rentalTerms.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ol>
      </section>

      <section className="rounded-[10px] border border-[#E5E5E5] bg-white p-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Cross-border Travel</h2>
        <p className="mt-2 text-sm font-semibold text-[#E8192C]">Not available</p>
        <p className="mt-3 text-sm leading-relaxed text-[#555]">
          You cannot leave Morocco with the rental car. All rentals are limited to the agreed service
          area within the Dakhla-Oued Ed-Dahab region unless otherwise approved in writing by{" "}
          {siteConfig.name}.
        </p>
      </section>

      <p className="mt-8 text-center text-sm text-[#888]">
        <Link href={routes.vehicles} className="font-medium text-[#3563E9] hover:underline">
          Browse vehicles
        </Link>
        {" · "}
        <Link href={routes.home} className="font-medium text-[#3563E9] hover:underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
