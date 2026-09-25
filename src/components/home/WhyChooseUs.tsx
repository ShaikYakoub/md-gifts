import React from "react";
import { Sparkles, Gem, PackageCheck, Truck } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      title: "Personalized",
      subtitle: "Made just for you",
      icon: Sparkles,
    },
    {
      title: "Premium Finish",
      subtitle: "High quality materials",
      icon: Gem,
    },
    {
      title: "Carefully Packed",
      subtitle: "Safe delivery",
      icon: PackageCheck,
    },
    {
      title: "Fast Delivery",
      subtitle: "Across India",
      icon: Truck,
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-[#FAF4F0]/60 border-y border-[#EDE2D8] my-4 sm:my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#221C1D]">
            Why Choose Us
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6C5E61]">
            Every gift is crafted with precision, passion, and the utmost care.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FAF0EC] border border-[#F3DDD5] group-hover:bg-[#FBE8E1] group-hover:border-[#E8BDB1] flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xs mb-3.5">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#C85250] stroke-[1.8]" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-[#221C1D]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6D70] mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
