# Bright Table

A powerful, feature-rich React table library designed for modern web applications. Built with TypeScript, this table component offers comprehensive functionality for data display, manipulation, and user interaction.

## ✨ Features

### 🔧 Core Functionality
- **Virtual Scrolling** - High performance rendering for large datasets
- **Server-side Pagination** - Laravel-compatible pagination support
- **Sorting** - Built-in column sorting with custom sort indicators
- **Row Selection** - Single and multi-row selection with checkboxes
- **Tree Tables** - Hierarchical data display with expandable rows
- **Column Management** - Resizable, reorderable, and customizable columns

### 🎨 UI/UX Features
- **Responsive Design** - Mobile-friendly with touch support
- **RTL Support** - Right-to-left language compatibility
- **Striped Rows** - Alternating row colors for better readability
- **Hover Effects** - Interactive row highlighting
- **Bordered Layout** - Configurable cell and row borders
- **Loading States** - Built-in loading indicators and empty states

### 📱 Layout & Styling
- **Fixed Columns** - Pin columns to left or right
- **Column Groups** - Group related columns with headers
- **Auto Height** - Dynamic table height based on content
- **Custom Cell Rendering** - Flexible cell content with custom components
- **Cell Merging** - Span cells across rows and columns
- **CSS Variables** - Easy theming and customization

### ⚡ Performance & Accessibility
- **Optimized Rendering** - Memoized components for performance
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - ARIA attributes for accessibility
- **Touch Events** - Native mobile gesture support

## 📦 Installation

```bash
npm install @brightsoftware/table
# or
yarn add @brightsoftware/table
# or
bun add @brightsoftware/table
```

## 🚀 Quick Start

```tsx
import { Table, Column, HeaderCell, Cell } from '@brightsoftware/table';

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
];

function MyTable() {
  return (
    <Table data={data} height={400}>
      <Column width={100} align="center">
        <HeaderCell>ID</HeaderCell>
        <Cell dataKey="id" />
      </Column>
      
      <Column width={200}>
        <HeaderCell>Name</HeaderCell>
        <Cell dataKey="name" />
      </Column>
      
      <Column width={250}>
        <HeaderCell>Email</HeaderCell>
        <Cell dataKey="email" />
      </Column>
      
      <Column width={100} align="center">
        <HeaderCell>Age</HeaderCell>
        <Cell dataKey="age" />
      </Column>
    </Table>
  );
}
```

## 📋 Core Components

### Table
The main table component that orchestrates all functionality.

**Key Props:**
- `data` - Array of row data objects
- `height` - Table height (enables virtual scrolling)
- `autoHeight` - Dynamic height based on content
- `loading` - Show loading state
- `rowKey` - Unique identifier for rows
- `isTree` - Enable tree table mode
- `rowSelection` - Enable row selection
- `pagination` - Server-side pagination configuration

### Column
Defines table columns with various display and behavior options.

**Key Props:**
- `width` - Fixed column width
- `flexGrow` - Flexible column sizing
- `resizable` - Allow column resizing
- `sortable` - Enable column sorting
- `align` - Text alignment
- `fixed` - Pin column to left/right

### Cell
Renders individual table cells with custom content support.

**Key Props:**
- `dataKey` - Data property to display
- `children` - Custom cell renderer function
- `rowSpan` - Span across multiple rows
- `colSpan` - Span across multiple columns

### HeaderCell
Renders column headers with sorting and customization features.

**Key Props:**
- `children` - Header content
- `sortable` - Enable sorting
- `resizable` - Allow column resizing
- `customizable` - Enable column customization

## 🌳 Advanced Features

### Tree Tables
Display hierarchical data with expandable rows:

```tsx
<Table 
  data={treeData} 
  isTree 
  rowKey="id"
  defaultExpandAllRows
>
  <Column treeCol>
    <HeaderCell>Name</HeaderCell>
    <Cell dataKey="name" />
  </Column>
</Table>
```

### Row Selection
Enable single or multi-row selection:

```tsx
<Table 
  data={data} 
  rowSelection
  onRowSelect={(selectionState) => {
    console.log('Selected rows:', selectionState);
  }}
>
  {/* columns */}
</Table>
```

### Server-side Pagination
Laravel-compatible pagination support:

```tsx
<Table 
  data={data}
  pagination={{
    serverResponse: laravelPaginationResponse,
    onPageChange: (page) => fetchData(page),
    onRowsPerPageChange: (perPage) => updatePageSize(perPage),
    linkComponent: {
      element: <a />,
      urlProp: "href"
    }
  }}
>
  {/* columns */}
</Table>
```

### Custom Cell Rendering
Create custom cell content:

```tsx
<Column>
  <HeaderCell>Actions</HeaderCell>
  <Cell>
    {(rowData, rowIndex) => (
      <div>
        <button onClick={() => edit(rowData)}>Edit</button>
        <button onClick={() => delete(rowData.id)}>Delete</button>
      </div>
    )}
  </Cell>
</Column>
```

### Fixed Columns
Pin important columns to left or right:

```tsx
<Column fixed="left" width={100}>
  <HeaderCell>ID</HeaderCell>
  <Cell dataKey="id" />
</Column>

<Column fixed="right" width={120}>
  <HeaderCell>Actions</HeaderCell>
  <Cell>{/* action buttons */}</Cell>
</Column>
```

## 🎨 Styling & Theming

The table uses CSS variables for easy customization:

```css
:root {
  --border-color: #e5e7eb;
  --bt-striped-row-bg: #f9fafb;
  --bt-striped-extended-row-bg: #f3f4f6;
}
```

## 📱 Responsive Design

The table automatically adapts to different screen sizes and supports touch interactions on mobile devices.

## ♿ Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- Focus management
- High contrast support

## 🔧 TypeScript Support

Fully typed with comprehensive TypeScript definitions:

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

<Table<User> data={users} rowKey="id">
  {/* type-safe column definitions */}
</Table>
```

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏢 About

Developed by [Bright Office System](https://brightit.com.np/) - A leading software development company focused on creating modern, efficient web solutions.

---

For more examples and detailed documentation, visit our [documentation site](https://github.com/bright-office/table). 

