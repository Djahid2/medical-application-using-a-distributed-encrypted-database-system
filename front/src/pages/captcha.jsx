import React, { useRef, useEffect, useState } from "react";

const CaptchaImage = ({ captchaText }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Efface le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Style de fond
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ajoute des lignes aléatoires (effet brouillage)
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.8)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Style du texte
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Dessine le texte CAPTCHA avec rotation aléatoire
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    for (let i = 0; i < captchaText.length; i++) {
      const char = captchaText[i];
      const angle = Math.random() * 0.3 - 0.15; // Rotation aléatoire entre -15° et 15°
      ctx.save();
      ctx.translate(centerX + i * 25 - captchaText.length * 12.5, centerY);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, [captchaText]);

  return <canvas ref={canvasRef} width="200" height="60"></canvas>;
};

const Captcha = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isWaiting, setWaiting] = useState(false);
  const [errorCaptcha, setCaptchaError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (attempts >= 3 && !blocked) {
      // Si l'utilisateur a fait 3 tentatives infructueuses, on le bloque pendant 30 secondes
      setBlocked(true);
      setCaptchaError("You are blocked for 30 seconds.");
      setTimeout(() => {
        setBlocked(false);
        setAttempts(0);
        setCaptchaError(null);
        generateCaptcha();
      }, 30000); // Block for 30 seconds
    }
  }, [attempts, blocked]);

  const handleVerify = () => {
    setWaiting(true);

    if (blocked) {
      return; // Si l'utilisateur est bloqué, il ne peut pas essayer de nouveau.
    }

    if (userInput.toUpperCase() === captchaText) {
      onVerify(true);
      setAttempts(0); // Réinitialise les tentatives après une réussite
    } else {
      setCaptchaError("Invalid CAPTCHA.");
      generateCaptcha(); // Régénère le CAPTCHA
      setUserInput(""); // Réinitialise l'entrée utilisateur
      setAttempts(prevAttempts => prevAttempts + 1); // Incrémente les tentatives
    }

    setWaiting(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <CaptchaImage captchaText={captchaText} />
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Enter the CAPTCHA"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        {errorCaptcha && <p style={{ marginTop: '3%' }} className="errore">{errorCaptcha}</p>}
        <button
          style={{ minHeight: '46px', marginTop: '3%' }}
          onClick={handleVerify}
          disabled={blocked} // Désactive le bouton si l'utilisateur est bloqué
        >
          {isWaiting ? <span className="loader"></span> : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Captcha;
