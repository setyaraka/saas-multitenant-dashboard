import { Button } from "@heroui/button";
import Col from "./layout/col";
import Container from "./layout/container";
import Row from "./layout/row";
import {
  AnalyticIcon,
  AuditLogIcon,
  FolderIcon,
  HomeIcon,
  MenuIcon,
  OperationIcon,
  OrderIcon,
  SettingIcon,
  UserIcon,
} from "./icons";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const iconClassName = "w-5 h-5 text-gray-800 border-none";
  const navigate = useNavigate();
  const location = useLocation();

  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const linkTo = (label: string, parent?: string) => {
    const slug = toSlug(label);
    if (!parent && slug === "overview") return "/";
    return `/${parent ? `${toSlug(parent)}/` : ""}${slug}`;
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const baseBtn = "justify-start w-full mt-2";
  const activeBtn =
    "bg-default-100 text-foreground font-medium data-[hover=true]:bg-default-200";

  type NavBtnProps = {
    to: string;
    label: string;
    Icon?: React.ElementType;
    className?: string;
  };

  const NavButton: React.FC<NavBtnProps> = ({ to, label, Icon, className }) => (
    <Button
      variant="light"
      className={`${baseBtn} ${isActive(to) ? activeBtn : ""} ${className ?? ""}`}
      onPress={() => navigate(to)}
    >
      {Icon ? <Icon className={iconClassName} /> : null}
      {label}
    </Button>
  );

  return (
    <div className="w-81 h-screen bg-white p-4 shadow-md border-r border-gray-200">
      <Row className="my-2">
        <Col className="pr-3" xs={3}>
          <span className="ml-auto w-9 h-9 bg-gray-400 rounded-xl flex items-center justify-center text-white font-semibold">
            A
          </span>
        </Col>
        <Col xs={9}>
          <p className="text-sm font-semibold">Alpha Coffee</p>
          <p className="text-xs text-gray-500">Multi-tenant demo</p>
        </Col>
      </Row>

      <Container className="mt-5">
        <p className="mb-2 text-xs uppercase font-semibold text-gray-500">OVERVIEW</p>
      </Container>
      <div>
        <NavButton to={linkTo("Overview")} label="Overview" Icon={HomeIcon} />
        <NavButton to={linkTo("Orders")} label="Orders" Icon={OrderIcon} />
        <NavButton to={linkTo("Menu")} label="Menu" Icon={MenuIcon} />
        <NavButton to={linkTo("Analytics")} label="Analytics" Icon={AnalyticIcon} />
      </div>

      <Container className="mt-5">
        <p className="mb-2 text-xs uppercase font-semibold text-gray-500">MANAGEMENT</p>
      </Container>
      <div>
        <Accordion isCompact variant="splitted">
          <AccordionItem
            startContent={<FolderIcon className={iconClassName} />}
            key="1"
            aria-label="catalog"
            title="Catalog"
          >
            <NavButton to={linkTo("Categories", "Catalog")} label="Categories" />
            <NavButton to={linkTo("Modifier", "Catalog")} label="Modifier" />
          </AccordionItem>

          <AccordionItem
            startContent={<OperationIcon className={iconClassName} />}
            key="2"
            aria-label="operations"
            title="Operations"
          >
            <NavButton to={linkTo("Kitchen Display", "Operations")} label="Kitchen Display" />
            <NavButton to={linkTo("Shift", "Operations")} label="Shift" />
          </AccordionItem>

          <AccordionItem
            startContent={<UserIcon className={iconClassName} />}
            key="3"
            aria-label="users & role"
            title="Users & Role"
          >
            <NavButton to={linkTo("Users", "Users & Role")} label="Users" />
            <NavButton to={linkTo("Role", "Users & Role")} label="Role" />
          </AccordionItem>
        </Accordion>
      </div>

      <Container className="mt-5">
        <p className="mb-2 text-xs uppercase font-semibold text-gray-500">SYSTEM</p>
      </Container>
      <div>
        <NavButton to={linkTo("Settings")} label="Settings" Icon={SettingIcon} />
        <NavButton to={linkTo("Audit Log")} label="Audit Log" Icon={AuditLogIcon} />
      </div>
    </div>
  );
}
