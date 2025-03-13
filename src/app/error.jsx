"use client";

import NextError from "next/error";

export default function Error({ error }) {
  return <NextError statusCode={500} title={error.message} />;
}
