import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { normalizeText, type BingoPrompt } from "@/lib/bingo";
import {
  defaultPlayerColor,
  playerColorOptions,
  type PlayerColor,
} from "@/lib/playerColors";

interface ListEntry extends BingoPrompt {
  iconURL?: string;
  color?: PlayerColor;
}

interface BingoListEditorProps {
  title: string;
  description: string;
  entryLabel: string;
  entries: ListEntry[];
  onSave: (entries: ListEntry[]) => void;
  showPlayerAppearance?: boolean;
  addOnEnter?: boolean;
  triggerClassName?: string;
}

const fieldClass =
  "min-h-11 min-w-0 rounded-sm border border-input bg-muted px-3 text-base focus-visible:outline-2 focus-visible:outline-ring";

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export default function BingoListEditor({
  title,
  description,
  entryLabel,
  entries,
  onSave,
  triggerClassName,
  showPlayerAppearance = false,
  addOnEnter = false,
}: BingoListEditorProps) {
  const formId = useId();
  const nextFocus = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ListEntry[]>([]);
  const [error, setError] = useState("");

  function changeOpen(isOpen: boolean) {
    if (isOpen) {
      setDraft(entries);
      setError("");
    }
    setOpen(isOpen);
  }

  function addEntry() {
    const id = crypto.randomUUID();
    nextFocus.current = id;
    setDraft((current) => [
      ...current,
      {
        id,
        text: "",
        ...(showPlayerAppearance && {
          color:
            playerColorOptions.find(
              (color) => !current.some((entry) => entry.color === color),
            ) ?? defaultPlayerColor(current.length),
        }),
      },
    ]);
  }

  function updateEntry(id: string, changes: Partial<ListEntry>) {
    setDraft((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, ...changes } : entry,
      ),
    );
    setError("");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = draft.map(({ id, text, iconURL, color }) => ({
      id,
      text: text.trim(),
      ...(showPlayerAppearance && { iconURL: iconURL?.trim() ?? "", color }),
    }));
    const names = cleaned.map(({ text }) => normalizeText(text));
    if (names.includes("")) {
      setError(`Enter text for each ${entryLabel.toLowerCase()}.`);
      return;
    }
    if (new Set(names).size !== names.length) {
      setError(`Use a different name for each ${entryLabel.toLowerCase()}.`);
      return;
    }
    for (const { iconURL, text } of cleaned) {
      if (iconURL && !isHttpsUrl(iconURL)) {
        setError(`Enter an HTTPS avatar image URL for ${text}.`);
        return;
      }
    }
    onSave(cleaned);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className={triggerClassName}>
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-sm border-input bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4">
          {draft.length > 0 && (
            <ul className="grid gap-2">
              {draft.map(({ id, text, iconURL, color }, index) => (
                <li
                  key={id}
                  className="flex flex-wrap items-end gap-2 sm:flex-nowrap"
                >
                  <div className="grid flex-1 gap-1">
                    <label
                      htmlFor={`${formId}-${id}`}
                      className="text-sm text-muted-foreground"
                    >
                      {entryLabel} {index + 1}
                    </label>
                    <input
                      id={`${formId}-${id}`}
                      ref={(input) => {
                        if (input && nextFocus.current === id) {
                          nextFocus.current = null;
                          input.focus();
                        }
                      }}
                      type="text"
                      value={text}
                      enterKeyHint={addOnEnter ? "next" : undefined}
                      onKeyDown={(event) => {
                        if (
                          !addOnEnter ||
                          event.key !== "Enter" ||
                          event.nativeEvent.isComposing
                        )
                          return;
                        event.preventDefault();
                        if (!event.repeat) addEntry();
                      }}
                      onChange={(event) =>
                        updateEntry(id, { text: event.target.value })
                      }
                      className={fieldClass}
                    />
                    {showPlayerAppearance && (
                      <>
                        <label
                          htmlFor={`${formId}-${id}-avatar`}
                          className="mt-1 text-sm text-muted-foreground"
                        >
                          Steam avatar image URL (optional)
                        </label>
                        <input
                          id={`${formId}-${id}-avatar`}
                          type="text"
                          inputMode="url"
                          value={iconURL ?? ""}
                          onChange={(event) =>
                            updateEntry(id, { iconURL: event.target.value })
                          }
                          className={fieldClass}
                        />
                        <label
                          htmlFor={`${formId}-${id}-color`}
                          className="mt-1 text-sm text-muted-foreground"
                        >
                          Color for player {index + 1}
                        </label>
                        <select
                          id={`${formId}-${id}-color`}
                          value={color ?? defaultPlayerColor(index)}
                          onChange={(event) =>
                            updateEntry(id, {
                              color: event.target.value as PlayerColor,
                            })
                          }
                          className={fieldClass}
                        >
                          {playerColorOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={`Remove ${entryLabel.toLowerCase()} ${index + 1}`}
                    className="min-h-11 text-selected-foreground hover:bg-selected hover:text-selected-foreground"
                    onClick={() => {
                      setDraft((current) =>
                        current.filter((entry) => entry.id !== id),
                      );
                      setError("");
                    }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={addEntry}
            className="min-h-11 justify-self-start bg-card text-card-foreground"
          >
            Add {entryLabel.toLowerCase()}
          </Button>
          {error && (
            <p role="alert" className="text-sm text-selected-foreground">
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="min-h-11"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="min-h-11">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
