"use client";

import React, { useState } from "react";
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker, 
  HiOutlineChatAlt2,
  HiCheckCircle,
  HiOutlineArrowRight
} from "react-icons/hi";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this to your API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
            Get in <span className="italic font-light text-slate-400">Touch.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-xl mx-auto uppercase tracking-widest">
            We're here to help you find the perfect lighting for your home.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CONTACT INFO CARDS */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <HiOutlinePhone className="text-2xl" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Call Us</h3>
              <p className="text-slate-500 font-bold mb-4">Monday - Saturday (10AM - 8PM)</p>
              <a href="tel:01700-000000" className="text-xl font-black text-blue-600 hover:underline transition">01700-000000</a>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <HiOutlineMail className="text-2xl" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Email Support</h3>
              <p className="text-slate-500 font-bold mb-4">We usually reply within 24 hours.</p>
              <a href="mailto:support@hatimzone.com" className="text-xl font-black text-green-600 hover:underline transition">support@hatimzone.com</a>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <HiOutlineLocationMarker className="text-2xl" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Showroom</h3>
              <p className="text-slate-500 font-bold">Dhaka, Bangladesh</p>
              <p className="text-sm text-slate-400 mt-2 font-medium">Visit us for a live demo of our premium collection.</p>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-sm border border-gray-100 relative h-full">
              <div className="mb-12">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Send a Message</h2>
                <p className="text-slate-500 font-medium">Have a specific question or custom order request? Drop us a line.</p>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-6">
                  <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                    <HiCheckCircle className="text-6xl" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Message Received!</h3>
                  <p className="text-slate-500 font-bold max-w-xs">Thank you for reaching out. Our team will contact you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="text-blue-600 font-black uppercase text-xs tracking-widest hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none transition"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none transition"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Subject</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none transition"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={(e) => setForm({...form, subject: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Message</label>
                    <textarea 
                      required
                      rows="6"
                      className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none transition resize-none"
                      placeholder="Your message here..."
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="group bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-slate-800 transition active:scale-95 shadow-xl shadow-gray-200"
                  >
                    Send Message
                    <HiOutlineArrowRight className="group-hover:translate-x-1 transition" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAP PLACEHOLDER */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="bg-white p-4 rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden h-96">
          <div className="w-full h-full bg-slate-100 rounded-[2.5rem] flex items-center justify-center flex-col text-slate-400">
            <HiOutlineChatAlt2 className="text-6xl mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Live Showroom Map Coming Soon</p>
          </div>
        </div>
      </section>
    </div>
  );
}
