import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: "URL path for this page (e.g. 'about' becomes /about)",
    }),
    defineField({
      name: "menuOrder",
      title: "Menu Order",
      type: "number",
      description: "Order in the navigation menu (lower = first)",
      initialValue: 10,
    }),
    defineField({
      name: "sections",
      title: "Sections",
      description: "Page sections. Each has a heading, body, and optional image.",
      type: "array",
      of: [
        {
          type: "object",
          name: "section",
          title: "Section",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [{ type: "block" }],
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              description: "Optional. If empty, the text fills the full width.",
            }),
            defineField({
              name: "imagePosition",
              title: "Image Position",
              type: "string",
              options: {
                list: [
                  { title: "Right", value: "right" },
                  { title: "Left", value: "left" },
                ],
                layout: "radio",
              },
              initialValue: "right",
            }),
          ],
          preview: {
            select: { title: "heading" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }) {
      return { title, subtitle: `/${slug}` };
    },
  },
});
