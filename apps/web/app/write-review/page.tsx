"use client";

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
import { reviewSchema } from '@bedside/schemas/review';

const defaultReview = {
  target_type: 'facility',
  target_id: '',
  encounter_setting: 'inpatient',
  encounter_month: '',
  overall: 3,
  would_recommend: true,
  dimensions: {
    communication: 3,
    responsiveness: 3,
    cleanliness: 3,
    discharge_info: 3,
    wait_time: 3,
    empathy: 3,
  },
  text: '',
  tags: [] as string[],
  attestation: false,
};

export default function WriteReviewPage() {
  const [form, setForm] = useState({ ...defaultReview });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const mutation = useMutation({
    mutationFn: (data: typeof defaultReview) => axios.post('/api/v1/reviews', data),
    onSuccess: () => setForm({ ...defaultReview, target_type: form.target_type }),
    onError: (error: any) => {
      console.error(error);
    },
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type, checked } = event.target;
    if (name.startsWith('dimensions.')) {
      const key = name.split('.')[1] as keyof typeof defaultReview.dimensions;
      setForm((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [key]: Number(value) },
      }));
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parseResult = reviewSchema.safeParse(form);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      for (const err of parseResult.error.errors) {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate(form);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">Write a Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target selection */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Reviewing a
          </label>
          <select
            name="target_type"
            value={form.target_type}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          >
            <option value="facility">Facility</option>
            <option value="clinician">Clinician</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target ID</label>
          <input
            type="text"
            name="target_id"
            value={form.target_id}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
            required
          />
          {errors.target_id && <p className="text-xs text-red-600">{errors.target_id}</p>}
        </div>
        {/* Encounter details */}
        <div>
          <label className="block text-sm font-medium mb-1">Encounter Setting</label>
          <select
            name="encounter_setting"
            value={form.encounter_setting}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          >
            <option value="inpatient">Inpatient</option>
            <option value="outpatient">Outpatient</option>
            <option value="ed">Emergency/ED</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Encounter Month</label>
          <input
            type="month"
            name="encounter_month"
            value={form.encounter_month}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
            required
          />
          {errors.encounter_month && <p className="text-xs text-red-600">{errors.encounter_month}</p>}
        </div>
        {/* Overall rating */}
        <div>
          <label className="block text-sm font-medium mb-1">Overall Rating</label>
          <input
            type="number"
            name="overall"
            min={1}
            max={5}
            value={form.overall}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
            required
          />
          {errors.overall && <p className="text-xs text-red-600">{errors.overall}</p>}
        </div>
        {/* Would recommend */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="would_recommend"
            checked={form.would_recommend}
            onChange={handleChange}
          />
          <label className="text-sm">I would recommend this provider</label>
        </div>
        {/* Dimensions */}
        <div>
          <h2 className="text-lg font-medium mb-2">Care Experience Dimensions (1–5)</h2>
          {Object.entries(form.dimensions).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2 mb-2">
              <label className="w-40 capitalize">{key.replace(/_/g, ' ')}</label>
              <input
                type="number"
                name={`dimensions.${key}`}
                min={1}
                max={5}
                value={value}
                onChange={handleChange}
                className="border rounded-md p-2 flex-1"
              />
            </div>
          ))}
        </div>
        {/* Text */}
        <div>
          <label className="block text-sm font-medium mb-1">Review Text</label>
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
            rows={4}
          />
          {errors.text && <p className="text-xs text-red-600">{errors.text}</p>}
        </div>
        {/* Attestation */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="attestation"
            checked={form.attestation}
            onChange={handleChange}
            required
          />
          <label className="text-sm">
            I attest that this review reflects my personal experience and complies with the community
            guidelines.
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Submitting…' : 'Submit Review'}
        </button>
        {mutation.isSuccess && (
          <p className="text-green-600 text-sm mt-2">Review submitted successfully! Thank you.</p>
        )}
        {mutation.isError && (
          <p className="text-red-600 text-sm mt-2">An error occurred. Please try again.</p>
        )}
      </form>
    </main>
  );
}
