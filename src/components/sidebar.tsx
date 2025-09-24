import { Button } from "@heroui/button";
import Col from "./layout/col";
import Container from "./layout/container";
import Row from "./layout/row";
import { AnalyticIcon, FolderIcon, HomeIcon, MenuIcon, OperationIcon, OrderIcon, SettingIcon, UserIcon } from "./icons";
import { Accordion, AccordionItem } from "@heroui/accordion";

export default function Sidebar() {
    const iconClassName = "w-5 h-5 text-gray-800 border-none";
    
    return (
        <div className="w-81 h-screen bg-white p-4 shadow-md border-r border-gray-200">
            <Row className="my-2">
                <Col className="pr-3" xs={3}>
                    <span className="ml-auto w-9 h-9 bg-gray-400 rounded-xl flex items-center justify-center text-white font-semibold">A</span>
                </Col>
                <Col xs={9}>
                    <p className="text-sm font-semibold">Alpha Coffee</p>
                    <p className="text-xs text-gray-500">Multi-tenant demo</p>
                </Col>
            </Row>
            <Container className="mt-5">
                <p className="mb-2 text-xs uppercase font-semibold text-gray-500">
                    OVERVIEW
                </p>
            </Container>
            <div>
                <Button variant="light" className="justify-start w-full mt-2">
                    <HomeIcon className={iconClassName} /> Overview
                </Button>
                <Button variant="light" className="justify-start w-full mt-2">
                    <OrderIcon className={iconClassName} /> Orders
                </Button>
                <Button variant="light" className="justify-start w-full mt-2">
                    <MenuIcon className={iconClassName} /> Menu
                </Button>
                <Button variant="light" className="justify-start w-full mt-2">
                    <HomeIcon className={iconClassName} /> Analytics
                </Button>
            </div>
            <Container className="mt-5">
                <p className="mb-2 text-xs uppercase font-semibold text-gray-500">
                    MANAGEMENT
                </p>
            </Container>
            <div>
            <Accordion isCompact variant="splitted">
                <AccordionItem startContent={<FolderIcon className={iconClassName}/>} key="1" aria-label="catalog" title="Catalog">
                    <Button variant="light" className="justify-start w-full mt-2">
                        Categories
                    </Button>
                    <Button variant="light" className="justify-start w-full mt-2">
                        Modifier
                    </Button>
                </AccordionItem>
                <AccordionItem startContent={<OperationIcon className={iconClassName}/>} key="2" aria-label="operations" title="Operations">
                    <Button variant="light" className="justify-start w-full mt-2">
                        Kitchen Display
                    </Button>
                    <Button variant="light" className="justify-start w-full mt-2">
                        Shift
                    </Button>
                </AccordionItem>
                <AccordionItem startContent={<UserIcon className={iconClassName}/>} key="3" aria-label="users & role" title="Users & Role">
                    <Button variant="light" className="justify-start w-full mt-2">
                        Users
                    </Button>
                    <Button variant="light" className="justify-start w-full mt-2">
                        Role
                    </Button>
                </AccordionItem>
            </Accordion>
            </div>
            <Container className="mt-5">
                <p className="mb-2 text-xs uppercase font-semibold text-gray-500">
                    SYSTEM
                </p>
            </Container>
            <div>
                <Button variant="light" className="justify-start w-full mt-2">
                    <SettingIcon className={iconClassName} /> Settings
                </Button>
                <Button variant="light" className="justify-start w-full mt-2">
                    <AnalyticIcon className={iconClassName} /> Analytics
                </Button>
            </div>
        </div>
    )
}