"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LangContext";

// Կապի էջ
export  function Contact() {
  const { data } = useLanguage();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(data.contactForm.messages[0]);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus(data.contactForm.messages[1]);
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus(data.contactForm.messages[2]);
      }
    } catch (err) {
      console.error(err);
      setStatus(data.contactForm.messages[3]);
    }
  };

  return (
    <div className="ContactPage">
      {/* Hero Section */}
      <div className="relative w-full h-[30vh] sm:h-[70vh] flex items-center justify-center">
        <Image
          src={data.infoContact.image}
          alt="Քոլեջի շենքի պատկեր"
          fill
          className="object-cover -z-10"
          priority
        />
        {/* <h1 className="hidden sm:block text-2xl sm:text-4xl font-bold text-white bg-black/40 p-6 rounded-2xl text-center">
          {data.infoContact.contact}
        </h1> */}
      </div>

      {/* Contact Info + Form */}
      <div className="mx-auto bg-white mt-0 sm:-mt-12 mb-0 sm:mb-10 p-6 sm:p-16 sm:rounded-xl shadow-lg w-full sm:w-[70%] max-w-6xl">
        <h2 className="text-center text-xl sm:text-3xl text-[#004471] mb-10 sm:mb-12 font-bold">
          {data.infoContact.title}
        </h2>

        <div className="flex flex-col lg:flex-row justify-between gap-10">
          {/* Contact Info */}
          <div className="text-[16px] sm:text-[18px] leading-loose max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <ul className="list-none p-0">
              <li>
                <strong className="text-[#004471]">📍 {data.infoContact.location[0]}:</strong>{" "}
                {data.infoContact.location[1]}
              </li>
              <li>
                <strong className="text-[#004471]">📞 {data.infoContact.phone[0]}:</strong>{" "}
                {data.infoContact.phone[1]}
              </li>
              <li>
                <strong className="text-[#004471]">📧 {data.infoContact.email[0]}:</strong>{" "}
                {data.infoContact.email[1]}
              </li>
              <li>
                <strong className="text-[#004471]">⏰ {data.infoContact.hours[0]}:</strong>{" "}
                {data.infoContact.hours[1]}
              </li>
            </ul>

            <div className="flex justify-center lg:justify-start mt-5 gap-3">
              <a href="#" aria-label="Facebook">
                <div className="w-10 sm:w-12.5 relative rounded-full hover:scale-110 transition-transform duration-200">
                  <Image
                    src="/img/contact/facebook.png"
                    alt="Facebook"
                    fill
                    className="rounded-full object-contain"
                  />
                </div>
              </a>

              <a href="#" aria-label="Instagram">
                <div className="w-10 sm:w-12.5 relative rounded-full hover:scale-110 transition-transform duration-200">
                  <Image
                    src="/img/contact/insta.png"
                    alt="Instagram"
                    fill
                    className="rounded-full object-contain"
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-[50%] mx-auto">
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              <input
                type="text"
                name="name"
                placeholder={data.contactForm.placheolders[0]}
                value={form.name}
                onChange={handleChange}
                required
                className="w-full h-14 p-2 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
              <input
                type="email"
                name="email"
                placeholder={data.contactForm.placheolders[1]}
                value={form.email}
                onChange={handleChange}
                required
                className="w-full h-14 p-2 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
              <textarea
                name="message"
                rows={5}
                placeholder={data.contactForm.placheolders[2]}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full  p-2 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
              <button
                type="submit"
                className="bg-[#004471] h-14 text-white px-6 py-3 rounded-lg text-[16px] hover:bg-[#002d4f] transition-colors"
              >
                {data.infoContact.buttonTxt}
              </button>
            </form>

            {status && <p className="mt-4 text-center">{status}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}