"use client";
import { useState } from "react";
import NavBar from "@/components/home/NavBar";
import LoginModalScreen from "@/components/login/LoginModalScreen";
import SignupFlowManager from "../signup/NewSignUp";
import PasswordResetModal from "@/components/login/PasswordResetModal";

const Home = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-center bg-cover bg-no-repeat font-sans text-white"
      style={{ backgroundImage: "url('/home/herobg.png')" }}
    >
      <div className="absolute top-0 left-0 w-full z-50">
        <NavBar
          onLoginClick={() => setLoginModalOpen(true)}
          onSignUpClick={() => setSignUp(true)}
        />
      </div>
      <div className="flex w-full max-w-4xl flex-col items-center px-4">
        {/* Badge */}
        <div className="mb-6 flex items-center gap-2 rounded-full bg-[#2767E7]/20 px-6 py-3.5 font-medium text-base shadow-md">
          <span role="img" aria-label="globe">
            🌍
          </span>{" "}
          Join the Global Adventure Community
        </div>
        {/* Heading */}
        <h1 className="mb-2 text-center font-light text-4xl sm:text-5xl lg:text-8xl">
          Every Journey <br />
          <span className="font-extrabold">Leaves a Mark</span>
        </h1>
        {/* Subheading */}
        <p className="mb-8 max-w-2xl text-center text-lg text-white/90 sm:text-xl">
          Share yours with the world through our community-powered platform
          <br />
          for <span className="text-[#FF8400]">explorers</span>,{" "}
          <span className="text-[#FF8400]">storytellers</span>, and{" "}
          <span className="text-[#FF8400]">adventure creators</span>
        </p>
        {/* Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => setSignUp(true)}
            className="cursor-pointer rounded-md bg-[#FF8400] px-7 py-3 font-semibold text-base text-white shadow-md transition-colors duration-200 hover:bg-[#ff9900]"
          >
            Join the Tribe
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md border border-white/40 bg-transparent px-7 py-3 font-semibold text-base text-white shadow-md transition-colors duration-200 hover:bg-white/20"
          >
            Explore Trail
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md border border-white/40 bg-transparent px-7 py-3 font-semibold text-base text-white shadow-md transition-colors duration-200 hover:bg-white/20"
          >
            Host or Guide
          </button>
        </div>
      </div>
      {loginModalOpen && (
        <LoginModalScreen
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSwitchToSignup={() => {
            setLoginModalOpen(false);
            setSignUp(true);
          }}
          onShowResetModal={() => {
            setLoginModalOpen(false);
            setShowResetModal(true);
          }}
        />
      )}
      {signUp && (
        <SignupFlowManager
          setSignUp={setSignUp}
          onSwitchToLogin={() => {
            setSignUp(false);
            setLoginModalOpen(true);
          }}
        />
      )}
      {showResetModal && (
        <PasswordResetModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
};

export default Home;
