// Components==============
import React from 'react';
import { motion } from 'framer-motion';
import './Logo.module.scss';
// =========================

export default function Logo() {
  return (
    <motion.div
      styleName="wrapper"
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 360] }}
      transition={{ repeat: Infinity, repeatDelay: 2, duration: 1.5 }}
    >
      <img src="/images/tast.svg" alt="logo" />
    </motion.div>
  );
}
