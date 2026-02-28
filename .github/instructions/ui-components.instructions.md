---
description: Read this before creating or modifying any UI components in the project.
---

# UI Components Guidelines

## Overview

This project uses **shadcn/ui** (New York style) exclusively for all UI components. Custom components should NOT be created when shadcn/ui provides an equivalent solution.

## Core Rules

### 1. Always Use shadcn/ui Components

- **DO NOT** create custom UI components (buttons, inputs, dialogs, etc.)
- **ALWAYS** use shadcn/ui components from `@/components/ui`
- Check [shadcn/ui documentation](https://ui.shadcn.com) before building anything

### 2. Component Installation

Install components as needed:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
# etc.
```

### 3. Available Components

Common shadcn/ui components to use:

- **Forms**: Input, Textarea, Select, Checkbox, Radio, Switch, Label
- **Buttons**: Button, Toggle, ToggleGroup
- **Layout**: Card, Separator, Tabs, Sheet, Dialog
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Navigation**: NavigationMenu, Breadcrumb, Pagination
- **Data Display**: Table, Badge, Avatar, Tooltip
- **Overlays**: Dialog, Popover, DropdownMenu, Sheet, HoverCard

Full list: [shadcn/ui components](https://ui.shadcn.com/docs/components)

## Usage Patterns

### Basic Component Import

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Customizing Components

Use the `cn()` utility for additional styles:

```typescript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

<Button className={cn("w-full", "mt-4")}>
  Custom Styled Button
</Button>
```

### Variants

shadcn/ui components come with built-in variants:

```typescript
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">😀</Button>
```

## Component Composition

Create feature-specific components by composing shadcn/ui primitives:

```typescript
// ✅ GOOD: Composing shadcn/ui components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function LinkCard({ title, url }: { title: string; url: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{url}</p>
        <Button className="mt-2">Visit</Button>
      </CardContent>
    </Card>
  );
}

// ❌ BAD: Creating custom card component
export function CustomCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      {children}
    </div>
  );
}
```

## Forms with shadcn/ui

Use React Hook Form + shadcn/ui form components:

```typescript
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function MyForm() {
  const form = useForm();
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register('email')} />
        </div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
```

## Dark Mode Support

All shadcn/ui components support dark mode automatically through CSS variables defined in `globals.css`. No additional configuration needed.

## Icons

Use **Lucide React** for icons (bundled with shadcn/ui):

```typescript
import { Plus, Trash2, Edit, ExternalLink } from 'lucide-react';

<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Link
</Button>
```

## Best Practices

### 1. Check Before Building
Before creating any UI component, search shadcn/ui documentation to see if it exists.

### 2. Install Only What You Need
Don't install all components upfront. Add them as needed.

### 3. Leverage Composition
Build complex UIs by composing simple shadcn/ui components.

### 4. Use Semantic HTML
shadcn/ui components use proper semantic HTML. Don't wrap them unnecessarily.

### 5. Accessibility First
shadcn/ui components are built with accessibility in mind. Don't override ARIA attributes unless necessary.

## Common Patterns

### Dialog/Modal

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

### Dropdown Menu

```typescript
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Data Table

```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>URL</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.url}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Troubleshooting

### Component Not Found
Install the component first:
```bash
npx shadcn@latest add [component-name]
```

### Styling Issues
- Use `cn()` from `@/lib/utils` for conditional classes
- Follow Tailwind utility-first approach
- Don't override shadcn/ui's internal classes

### TypeScript Errors
- Check component prop types in shadcn/ui docs
- Use `asChild` prop for composition (Radix UI pattern)

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Radix UI Primitives](https://www.radix-ui.com/primitives) (underlying library)
- [Lucide Icons](https://lucide.dev)

---

**Remember**: Never reinvent the wheel. shadcn/ui provides production-ready, accessible components. Use them.
