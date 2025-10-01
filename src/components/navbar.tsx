import { Navbar as HeroUINavbar, NavbarContent } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";

import { CollapseIcon } from "./icons";

export default function Navbar() {
  return (
    <HeroUINavbar
      className="border-b border-gray-200 bg-brand"
      maxWidth="full"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <Button
          isIconOnly
          className="border-gray-200"
          size="sm"
          startContent={<CollapseIcon className="p-1" />}
          variant="bordered"
        />
        <span className="text-gray-600">Tenant</span>
        <Select
          className="w-45 text-white"
          placeholder="Select an tenant"
          size="sm"
          variant="bordered"
        >
          <SelectItem key="alpha">Alpha Coffee</SelectItem>
          <SelectItem key="bravo">Bravo Bites</SelectItem>
          <SelectItem key="charlie">Charlie Bakery</SelectItem>
        </Select>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <Button size="sm" variant="bordered">
          Invite
        </Button>
        <Button size="sm" variant="bordered">
          Live Demo
        </Button>
        <Button size="sm" variant="bordered">
          Dark Mode
        </Button>
      </NavbarContent>
    </HeroUINavbar>
  );
}
