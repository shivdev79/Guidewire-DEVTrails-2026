import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Bot, Loader2 } from 'lucide-react';

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** 0.8–1.2s before bot lines */
const replyDelay = () => 800 + Math.random() * 400;

const UNIVERSAL_TEXT = 'Want help with anything else?';

const STEPS = {
  welcome: {
    layout: 'grid',
    reply: "Hi, I'm Aegis Assistant.\n\nWhat issue are you facing?",
    buttons: [
      { label: '💸 Payment not received', next: 'pay_none_when' },
      { label: '⏳ Payment delayed', next: 'pay_del_1' },
      { label: '💰 Incorrect amount', next: 'pay_wrong_1' },
      { label: '📱 App issue', next: 'app_issue_1' },
      { label: '🚫 Not getting orders', next: 'no_ord_1' },
      { label: '🌧️ Work affected', next: 'work_aff_1' },
      { label: '❓ How this works', next: 'how_1' },
      { label: '📞 Contact support', next: 'contact_1' },
    ],
  },

  pay_none_when: {
    reply: "Got it. Let's check this.\n\nWhen were you expecting the payment?",
    buttons: [
      { label: '📅 Today', next: 'pay_none_recent' },
      { label: '🕐 Yesterday', next: 'pay_none_recent' },
      { label: '📆 Earlier', next: 'pay_none_earlier' },
      { label: '🔙 Back', next: 'welcome', silent: true },
    ],
  },
  pay_none_recent: {
    replies: [
      'Payments are usually processed after your activity period is evaluated.\nIf eligible, it should be credited shortly.',
      'If you still feel something is off, I can connect you to support.',
    ],
    buttons: [
      { label: '📞 Request a Call', action: 'request_call' },
      { label: '🔙 Back', next: 'pay_none_when', silent: true },
      { label: '✨ More topics', action: 'goto_universal' },
    ],
  },
  pay_none_earlier: {
    replies: [
      "If it's been a while, it's possible the activity didn't meet payout conditions.",
      'If you still feel something is off, I can connect you to support.',
    ],
    buttons: [
      { label: '📞 Request a Call', action: 'request_call' },
      { label: '🔙 Back', next: 'pay_none_when', silent: true },
      { label: '✨ More topics', action: 'goto_universal' },
    ],
  },

  pay_del_1: {
    reply:
      'Payments can sometimes take a little time depending on evaluation.\n\nWas this after a specific issue?',
    buttons: [
      { label: '🌧️ Weather', next: 'pay_del_2' },
      { label: '📱 App issue', next: 'pay_del_2' },
      { label: '🚫 No orders', next: 'pay_del_2' },
      { label: '❓ Not sure', next: 'pay_del_2' },
      { label: '🔙 Back', next: 'welcome', silent: true },
    ],
  },
  pay_del_2: {
    replies: [
      'Thanks. Aegis reviews these situations before processing payouts.\nIf it qualifies, the amount will be credited automatically.',
      'If it takes longer than expected, you can request support.',
    ],
    buttons: [
      { label: '📞 Request a Call', action: 'request_call' },
      { label: '✨ More topics', action: 'goto_universal' },
      { label: '🔙 Back', next: 'pay_del_1', silent: true },
    ],
  },

  pay_wrong_1: {
    reply: "Understood. Let's look into that.\n\nPayouts depend on how long and how much your work was affected.",
    nextAuto: 'pay_wrong_2',
  },
  pay_wrong_2: {
    reply:
      'The system calculates this based on activity and disruption level, so amounts may vary.',
    nextAuto: 'pay_wrong_3',
  },
  pay_wrong_3: {
    replies: ['If something feels incorrect, we can review it.'],
    buttons: [
      { label: '📞 Request a Call', action: 'request_call' },
      { label: '🔙 Back', next: 'welcome', silent: true },
      { label: '✨ More topics', action: 'goto_universal' },
    ],
  },

  app_issue_1: {
    reply: 'What kind of issue did you face?',
    buttons: [
      { label: '⚠️ App not loading', next: 'app_issue_2' },
      { label: '📉 Orders not showing', next: 'app_issue_2' },
      { label: '❌ Something else', next: 'app_issue_2' },
      { label: '🔙 Back', next: 'welcome', silent: true },
    ],
  },
  app_issue_2: {
    reply: 'App issues can affect your ability to work.\n\nAegis checks for such disruptions automatically.',
    nextAuto: 'app_issue_3',
  },
  app_issue_3: {
    replies: ['If your activity was impacted, you may receive a payout.'],
    buttons: [
      { label: '✨ More topics', action: 'goto_universal' },
      { label: '🔙 Back', next: 'app_issue_1', silent: true },
    ],
  },

  no_ord_1: {
    reply: 'Were you online and available for orders?',
    buttons: [
      { label: '✅ Yes', next: 'no_ord_yes' },
      { label: '❌ No', next: 'no_ord_no' },
      { label: '🔙 Back', next: 'welcome', silent: true },
    ],
  },
  no_ord_yes: {
    reply: 'Low demand can sometimes qualify as a disruption.',
    nextAuto: 'no_ord_3',
  },
  no_ord_no: {
    reply: 'Aegis usually considers active working time when evaluating payouts.',
    nextAuto: 'no_ord_3',
  },
  no_ord_3: {
    replies: ['If eligible, compensation is handled automatically.'],
    buttons: [
      { label: '✨ More topics', action: 'goto_universal' },
      { label: '🔙 Back', next: 'no_ord_1', silent: true },
    ],
  },

  work_aff_1: {
    reply: 'What affected your work?',
    buttons: [
      { label: '🌧️ Rain', next: 'work_aff_2' },
      { label: '🔥 Heat', next: 'work_aff_2' },
      { label: '🚧 Traffic / local issue', next: 'work_aff_2' },
      { label: '🔙 Back', next: 'welcome', silent: true },
    ],
  },
  work_aff_2: {
    reply: 'These situations can impact your earnings.\n\nAegis evaluates them in the background.',
    nextAuto: 'work_aff_3',
  },
  work_aff_3: {
    replies: ['If it meets the criteria, a payout is processed automatically.'],
    buttons: [
      { label: '✨ More topics', action: 'goto_universal' },
      { label: '🔙 Back', next: 'work_aff_1', silent: true },
    ],
  },

  how_1: {
    reply: 'Aegis runs alongside your work.',
    nextAuto: 'how_2',
  },
  how_2: {
    reply:
      "Here's what happens:\n\n• Your activity is monitored\n• Disruptions are detected\n• Payouts are processed automatically",
    nextAuto: 'how_3',
  },
  how_3: {
    replies: ['No claims or manual steps needed.'],
    buttons: [
      { label: '✨ More topics', action: 'goto_universal' },
      { label: '🔙 Back', next: 'welcome', silent: true },
    ],
  },

  contact_1: {
    reply: 'Need more help?',
    nextAuto: 'contact_2',
  },
  contact_2: {
    replies: ['I can arrange a quick call with our team.'],
    buttons: [
      { label: '📞 Request a Call', action: 'request_call' },
      { label: '🔙 Back', next: 'welcome', silent: true },
      { label: '✨ More topics', action: 'goto_universal' },
    ],
  },

  payments_hub: {
    reply: 'Which payment topic?',
    buttons: [
      { label: '💸 Not received', next: 'pay_none_when' },
      { label: '⏳ Delayed', next: 'pay_del_1' },
      { label: '💰 Incorrect amount', next: 'pay_wrong_1' },
      { label: '🔙 Back', next: 'universal', silent: true },
    ],
  },

  universal: {
    reply: UNIVERSAL_TEXT,
    buttons: [
      { label: '💰 Payments', next: 'payments_hub' },
      { label: '📱 App issues', next: 'app_issue_1' },
      { label: '❓ How it works', next: 'how_1' },
      { label: '❌ Exit', action: 'exit' },
    ],
  },
};

export default function Chatbot({ callbackPhone = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState('welcome');
  const [isThinking, setIsThinking] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [callFlow, setCallFlow] = useState('idle');
  const [phoneDraft, setPhoneDraft] = useState('');
  const [phoneEditMode, setPhoneEditMode] = useState(false);
  const [phoneEditInput, setPhoneEditInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isThinking, step, callFlow]);

  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setStep('welcome');
      setIsLocked(false);
      setCallFlow('idle');
      setPhoneEditMode(false);
      setPhoneEditInput('');
      setPhoneDraft('');
      return;
    }
    setIsThinking(true);
    const t = setTimeout(() => {
      setIsThinking(false);
      const w = STEPS.welcome;
      setMessages([{ id: uid(), role: 'assistant', text: w.reply }]);
      setStep('welcome');
    }, 400 + Math.random() * 350);
    return () => clearTimeout(t);
  }, [isOpen]);

  const appendAssistant = useCallback((text) => {
    setMessages((prev) => [...prev, { id: uid(), role: 'assistant', text }]);
  }, []);

  const playThinkingLine = useCallback(async (text) => {
    setIsThinking(true);
    await new Promise((r) => setTimeout(r, replyDelay()));
    setIsThinking(false);
    appendAssistant(text);
    await new Promise((r) => setTimeout(r, 280));
  }, [appendAssistant]);

  const deliverStepContent = useCallback(
    async (stepId) => {
      const cfg = STEPS[stepId];
      if (!cfg) return;
      if (cfg.replies?.length) {
        for (const line of cfg.replies) {
          await playThinkingLine(line);
        }
      } else if (cfg.reply) {
        await playThinkingLine(cfg.reply);
      }
      if (cfg.nextAuto) {
        await deliverStepContent(cfg.nextAuto);
        return;
      }
      setStep(stepId);
    },
    [playThinkingLine]
  );

  const deliverStep = useCallback(
    async (stepId) => {
      await deliverStepContent(stepId);
    },
    [deliverStepContent]
  );

  const runExit = useCallback(async () => {
    await playThinkingLine('Thanks for chatting. Take care out there.');
    await new Promise((r) => setTimeout(r, 700));
    setIsOpen(false);
  }, [playThinkingLine]);

  const appendUniversal = useCallback(async () => {
    await playThinkingLine(UNIVERSAL_TEXT);
    setStep('universal');
  }, [playThinkingLine]);

  const handleCallRequest = useCallback(async () => {
    setIsThinking(true);
    await new Promise((r) => setTimeout(r, replyDelay()));
    setIsThinking(false);
    appendAssistant('Got it. Our team will reach out to you shortly.');
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 350));
    const num = (phoneDraft || callbackPhone || '').trim();
    setPhoneDraft(num);
    const line = num
      ? num
      : 'No number on file yet — tap Edit to add your mobile number.';
    appendAssistant(`Is this the best number to reach you?\n\n${line}`);
    setCallFlow('phone');
  }, [appendAssistant, callbackPhone, phoneDraft]);

  const handlePhoneConfirm = useCallback(async () => {
    setMessages((prev) => [...prev, { id: uid(), role: 'user', text: '✅ Confirm' }]);
    setIsThinking(true);
    await new Promise((r) => setTimeout(r, replyDelay()));
    setIsThinking(false);
    appendAssistant("Your request has been received.\nYou'll get a call soon.");
    setCallFlow('idle');
    setPhoneEditMode(false);
    await new Promise((r) => setTimeout(r, 450));
    setIsThinking(true);
    await new Promise((r) => setTimeout(r, replyDelay()));
    setIsThinking(false);
    appendAssistant(UNIVERSAL_TEXT);
    setStep('universal');
  }, [appendAssistant]);

  const handlePhoneEditOpen = () => {
    setPhoneEditInput(phoneDraft || callbackPhone || '');
    setPhoneEditMode(true);
  };

  const handlePhoneEditSave = () => {
    const next = phoneEditInput.trim();
    setPhoneDraft(next);
    setPhoneEditMode(false);
    appendAssistant(
      next
        ? `Thanks — we'll use ${next} for this callback.`
        : "Number cleared — add a number when you're ready."
    );
  };

  const handleButton = async (btn) => {
    if (isLocked || isThinking) return;
    setIsLocked(true);
    try {
      if (btn.action === 'exit') {
        setMessages((prev) => [...prev, { id: uid(), role: 'user', text: btn.label }]);
        await runExit();
        return;
      }
      if (btn.action === 'goto_universal') {
        setMessages((prev) => [...prev, { id: uid(), role: 'user', text: btn.label }]);
        await appendUniversal();
        return;
      }
      if (btn.action === 'request_call') {
        setMessages((prev) => [...prev, { id: uid(), role: 'user', text: btn.label }]);
        await handleCallRequest();
        return;
      }

      setMessages((prev) => [...prev, { id: uid(), role: 'user', text: btn.label }]);

      if (btn.silent && btn.next) {
        setIsThinking(true);
        await new Promise((r) => setTimeout(r, 350));
        setIsThinking(false);
        setStep(btn.next);
        return;
      }

      if (btn.next) {
        await deliverStep(btn.next);
      }
    } finally {
      setIsLocked(false);
    }
  };

  const current = STEPS[step] || STEPS.welcome;
  const stepButtons = current.buttons || [];
  const useGrid = current.layout === 'grid' && step === 'welcome';
  const inPhoneFlow = callFlow === 'phone';

  const chipStyle = (primary) => ({
    background: primary ? '#007398' : 'white',
    border: `1px solid ${primary ? '#007398' : '#007398'}`,
    color: primary ? 'white' : '#007398',
    padding: '10px 12px',
    borderRadius: 14,
    fontSize: '0.8rem',
    textAlign: 'left',
    cursor: isThinking || isLocked ? 'not-allowed' : 'pointer',
    opacity: isThinking || isLocked ? 0.65 : 1,
    fontFamily: 'Outfit, sans-serif',
    lineHeight: 1.35,
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    boxShadow: primary ? '0 2px 8px rgba(0,115,152,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
  });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                bottom: 76,
                right: 0,
                width: 'min(400px, calc(100vw - 40px))',
                height: 'min(580px, calc(100vh - 100px))',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
                border: '1px solid #e8eef2',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #007398 0%, #005a78 100%)',
                  padding: '16px 18px',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Bot size={22} color="white" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Aegis Assistant</h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', opacity: 0.9 }}>Fast answers</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 4,
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  padding: '16px',
                  overflowY: 'auto',
                  background: '#f1f5f9',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      gap: '8px',
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: '#fbc02d',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      >
                        <Bot size={15} color="white" />
                      </div>
                    )}
                    <div
                      style={{
                        background: msg.role === 'user' ? 'rgba(0, 115, 152, 0.12)' : '#ffffff',
                        color: msg.role === 'user' ? '#0f172a' : '#1e293b',
                        border: msg.role === 'user' ? '1px solid rgba(0, 115, 152, 0.2)' : '1px solid #e8eef2',
                        padding: '10px 14px',
                        borderRadius: 14,
                        borderBottomRightRadius: msg.role === 'user' ? 4 : 14,
                        borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 14,
                        boxShadow: msg.role === 'assistant' ? '0 1px 6px rgba(0,0,0,0.05)' : 'none',
                        maxWidth: '85%',
                        fontSize: '0.9rem',
                        lineHeight: 1.55,
                        fontFamily: 'Outfit, sans-serif',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#fbc02d',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Loader2 size={15} color="white" className="chatbot-spin" />
                    </div>
                    <div
                      style={{
                        background: 'white',
                        padding: '10px 14px',
                        borderRadius: 14,
                        border: '1px solid #e8eef2',
                        fontSize: '0.85rem',
                        color: '#64748b',
                      }}
                    >
                      …
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div
                style={{
                  padding: '12px',
                  background: '#fff',
                  borderTop: '1px solid #e2e8f0',
                  flexShrink: 0,
                }}
              >
                <p
                  style={{
                    margin: '0 0 10px 0',
                    fontSize: '0.7rem',
                    color: '#64748b',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {inPhoneFlow ? 'Callback number' : 'Tap an option'}
                </p>

                {phoneEditMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phoneEditInput}
                      onChange={(e) => setPhoneEditInput(e.target.value)}
                      placeholder="Best number for a quick call"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #007398',
                        borderRadius: 12,
                        fontSize: '0.9rem',
                        fontFamily: 'Outfit, sans-serif',
                      }}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      <button type="button" onClick={handlePhoneEditSave} style={chipStyle(true)}>
                        Save number
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhoneEditMode(false)}
                        style={chipStyle(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : inPhoneFlow ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <button
                      type="button"
                      disabled={isThinking || isLocked}
                      onClick={handlePhoneConfirm}
                      style={chipStyle(true)}
                    >
                      ✅ Confirm
                    </button>
                    <button
                      type="button"
                      disabled={isThinking || isLocked}
                      onClick={handlePhoneEditOpen}
                      style={chipStyle(false)}
                    >
                      ✏️ Edit Number
                    </button>
                  </div>
                ) : (
                  <div
                    style={
                      useGrid
                        ? {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 8,
                          }
                        : { display: 'flex', flexWrap: 'wrap', gap: 8 }
                    }
                  >
                    {stepButtons.map((btn, idx) => (
                      <button
                        key={`${step}-${idx}-${btn.label}`}
                        type="button"
                        disabled={isThinking || isLocked}
                        onClick={() => handleButton(btn)}
                        onMouseEnter={(e) => {
                          if (!isThinking && !isLocked) e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                        }}
                        style={{
                          ...chipStyle(false),
                          minHeight: useGrid ? 48 : undefined,
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: '#007398',
            color: 'white',
            border: 'none',
            boxShadow: '0 8px 28px rgba(0, 115, 152, 0.45)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <MessageCircle size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
