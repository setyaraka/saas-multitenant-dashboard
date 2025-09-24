import { Navbar as HeroUINavbar, NavbarContent } from "@heroui/navbar"
import { MenuIcon } from "./icons"
import { Button } from "@heroui/button"
import { Select, SelectItem } from "@heroui/select"

export default function Navbar() {
    return (
        <HeroUINavbar maxWidth="full" position="sticky" className="border-b border-gray-200">
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <Button className="border-gray-200" isIconOnly startContent={<MenuIcon className="p-1" />} size="sm" variant="bordered"></Button>
                <span className="text-gray-600">Tenant</span>
                <Select variant="bordered" className="w-45" placeholder="Select an tenant" size="sm" >
                    <SelectItem key="alpha">Alpha Coffee</SelectItem>
                    <SelectItem key="bravo">Bravo Bites</SelectItem>
                    <SelectItem key="charlie">Charlie Bakery</SelectItem>
                </Select>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
                <Button size="sm" variant="bordered">Invite</Button>
                <Button size="sm" variant="bordered">Live Demo</Button>
                <Button size="sm" variant="bordered">Dark Mode</Button>
            </NavbarContent>
        </HeroUINavbar>
    )
}