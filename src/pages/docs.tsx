import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import { Select, SelectItem } from "@heroui/select";

export default function DocsPage() {
  const animals = [
    {key: "cat", label: "Cat"},
    {key: "dog", label: "Dog"},
    {key: "elephant", label: "Elephant"},
    {key: "lion", label: "Lion"},
    {key: "tiger", label: "Tiger"},
    {key: "giraffe", label: "Giraffe"},
    {key: "dolphin", label: "Dolphin"},
    {key: "penguin", label: "Penguin"},
    {key: "zebra", label: "Zebra"},
    {key: "shark", label: "Shark"},
    {key: "whale", label: "Whale"},
    {key: "otter", label: "Otter"},
    {key: "crocodile", label: "Crocodile"},
  ];
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Docs</h1>
        </div>
        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered">Open Menu</Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownItem key="new">New file</DropdownItem>
                                <DropdownItem key="copy">Copy link</DropdownItem>
                                <DropdownItem key="edit">Edit file</DropdownItem>
                                <DropdownItem key="delete" className="text-danger" color="danger">
                                Delete file
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Select className="max-w-xs" label="Select an animal" variant={"bordered"}>
            {animals.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
      </section>
    </DefaultLayout>
  );
}
